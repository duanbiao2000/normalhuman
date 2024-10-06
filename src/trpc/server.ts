import "server-only";

// 导入createHydrationHelpers函数，用于创建tRPC API的上下文
import { createHydrationHelpers } from "@trpc/react-query/rsc";
// 导入headers函数，用于获取请求头
import { headers } from "next/headers";
// 导入cache函数，用于缓存数据
import { cache } from "react";

// 导入createCaller函数和AppRouter类型，用于创建tRPC API的调用者
import { createCaller, type AppRouter } from "@/server/api/root";
// 导入createTRPCContext函数，用于创建tRPC API的上下文
import { createTRPCContext } from "@/server/api/trpc";
// 导入createQueryClient函数，用于创建查询客户端
import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
// 创建上下文函数，用于创建tRPC API的上下文
const createContext = cache(() => {
  // 创建Headers对象，并将请求头赋值给heads
  const heads = new Headers(headers());
  // 设置请求头x-trpc-source的值为rsc
  heads.set("x-trpc-source", "rsc");

  // 返回createTRPCContext函数的调用结果，传入heads作为参数
  return createTRPCContext({
    headers: heads,
  });
});

// 创建getQueryClient函数，用于创建查询客户端
const getQueryClient = cache(createQueryClient);
// 创建caller函数，用于创建tRPC API的调用者
const caller = createCaller(createContext);

// 导出createHydrationHelpers函数的调用结果，传入caller和getQueryClient作为参数
export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
);
