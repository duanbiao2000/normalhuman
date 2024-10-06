"use client";

// 导入QueryClientProvider和QueryClient，用于创建和管理查询客户端
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
// 导入loggerLink和unstable_httpBatchStreamLink，用于创建TRPC客户端的链接
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
// 导入createTRPCReact，用于创建TRPC客户端
import { createTRPCReact } from "@trpc/react-query";
// 导入inferRouterInputs和inferRouterOutputs，用于推断路由输入和输出类型
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
// 导入useState，用于在组件中创建状态
import { useState } from "react";
// 导入SuperJSON，用于序列化和反序列化数据
import SuperJSON from "superjson";

// 导入AppRouter，用于定义API路由
import { type AppRouter } from "@/server/api/root";
// 导入createQueryClient，用于创建查询客户端
import { createQueryClient } from "./query-client";

// 创建一个全局的查询客户端单例
let clientQueryClientSingleton: QueryClient | undefined = undefined;
// 获取查询客户端的方法
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // 服务器端：总是创建一个新的查询客户端
    return createQueryClient();
  }
  // 浏览器端：使用单例模式，保持相同的查询客户端
  return (clientQueryClientSingleton ??= createQueryClient());
};

// 创建TRPC客户端
export const api = createTRPCReact<AppRouter>();

/**
 * 推断输入类型的辅助工具。
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * 推断输出类型的辅助工具。
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// 创建TRPCReactProvider组件
export function TRPCReactProvider(props: { children: React.ReactNode }) {
  // 获取查询客户端
  const queryClient = getQueryClient();

  // 创建TRPC客户端
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        // 创建loggerLink，用于在开发环境中记录操作
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        // 创建unstable_httpBatchStreamLink，用于批量处理HTTP请求
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    })
  );

  // 返回QueryClientProvider和api.Provider组件，将查询客户端和TRPC客户端传递给子组件
  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

// 获取基础URL的方法
function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}