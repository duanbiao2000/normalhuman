// 导入zod库
import { z } from "zod";
// 导入createTRPCRouter和protectedProcedure函数
import { createTRPCRouter, protectedProcedure } from "../trpc";
// 导入authoriseAccountAccess函数
import { authoriseAccountAccess } from "./mail";
// 导入OramaManager类
import { OramaManager } from "@/lib/orama";
// 导入getEmbeddings函数
import { getEmbeddings } from "@/lib/embeddings";

// 创建searchRouter路由
export const searchRouter = createTRPCRouter({
    // 创建search函数，接收一个对象作为输入
    search: protectedProcedure.input(z.object({
        // accountId字段，类型为字符串
        accountId: z.string(),
        // query字段，类型为字符串
        query: z.string(),
    })).mutation(async ({ input, ctx }) => {
        // 从数据库中查找account表，根据id和userId查找
        const account = await ctx.db.account.findFirst({
            where: {
                id: input.accountId,
                userId: ctx.auth.userId,
            },
            select: {
                id: true
            }
        })

        // 如果没有找到account，抛出错误
        if (!account) throw new Error("Invalid token")
        // 创建OramaManager实例
        const oramaManager = new OramaManager(account.id);
        // 初始化OramaManager
        await oramaManager.initialize();


        // 获取输入中的query字段
        const { query } = input;
        // 在OramaManager中搜索query字段
        const results = await oramaManager.search({ term: query });
        // 返回搜索结果
        return results
    }),
});