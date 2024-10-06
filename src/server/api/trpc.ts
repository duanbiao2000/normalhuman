/**
 * 你可能不需要编辑这个文件，除非:
 * 1. 你想修改请求上下文（参见第1部分）。
 * 2. 你想创建一个新的中间件或过程类型（参见第3部分）。
 *
 * TL;DR - 这就是所有tRPC服务器内容创建和插入的地方。你需要使用的部分在相应位置进行了文档说明。
 */
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";

/**
 * 1. 上下文
 *
 * 这部分定义了后端API中可用的"上下文"。
 *
 * 这些允许你在处理请求时访问东西，如数据库、会话等。
 *
 * 这个助手生成了tRPC上下文的"内部"部分。API处理程序和RSC客户端都会包装这个，并提供所需上下文。
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const user = await auth()
  return {
    auth: user,
    db,
    ...opts,
  };
};

/**
 * 2. 初始化
 *
 * 这就是tRPC API初始化的地方，连接上下文和转换器。我们还解析ZodErrors，以便在后台验证失败时，前端可以获得类型安全性。
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 创建服务器端调用者。
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. 路由 & 过程（重要的部分）
 *
 * 这些是你用来构建tRPC API的部分。你应该在"/src/server/api/routers"目录中大量导入这些部分。
 */

/**
 * 这是你如何在tRPC API中创建新的路由和子路由的方法。
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * 中间件，用于计时过程执行并在开发中添加人工延迟。
 *
 * 如果你不喜欢这个，可以移除它，但它可以帮助捕获不需要的水流，通过模拟生产环境中会出现但在本地开发中不会出现的网络延迟。
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // 开发中的人工延迟
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

const isAuth = t.middleware(({ next, ctx }) => {
  if (!ctx.auth?.userId) {
    throw new Error("Unauthorized");
  }
  return next({ ctx: { ...ctx, auth: ctx.auth! as Required<typeof ctx.auth> } });
});

/**
 * 公共（未认证）过程
 *
 * 这是你用来在tRPC API中构建新查询和变更的基础部分。它不能保证查询的用户被授权，但你仍然可以在他们登录时访问用户会话数据。
 */
export const publicProcedure = t.procedure.use(timingMiddleware);
export const protectedProcedure = t.procedure.use(isAuth);
