// 导入默认的shouldDehydrateQuery函数和QueryClient类
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
// 导入SuperJSON库
import SuperJSON from "superjson";

// 创建一个查询客户端
export const createQueryClient = () =>
  new QueryClient({
    // 设置默认的查询选项
    defaultOptions: {
      queries: {
        // 在服务器端渲染时，我们通常希望设置一些默认的staleTime
        // 以避免在客户端立即重新获取
        staleTime: 30 * 1000,
      },
      // 设置数据序列化和反序列化函数
      dehydrate: {
        serializeData: SuperJSON.serialize,
        // 设置是否需要序列化查询的函数
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      // 设置数据反序列化函数
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
