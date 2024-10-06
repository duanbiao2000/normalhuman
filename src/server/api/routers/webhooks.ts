// 导入zod库
import { z } from "zod";
// 导入createTRPCRouter和protectedProcedure函数
import { createTRPCRouter, protectedProcedure } from "../trpc";
// 导入authoriseAccountAccess函数
import { authoriseAccountAccess } from "./mail";
// 导入Account类
import Account from "@/lib/account";

// 创建webhooksRouter路由
export const webhooksRouter = createTRPCRouter({
    // 获取webhooks
    getWebhooks: protectedProcedure.input(z.object({
        accountId: z.string()
    })).query(async ({ ctx, input }) => {
        // 根据accountId和userId授权账户访问
        const acc = await authoriseAccountAccess(input.accountId, ctx.auth.userId)
        // 创建Account实例
        const account = new Account(acc.token)
        // 调用getWebhooks方法获取webhooks
        return await account.getWebhooks()
    }),
    // 创建webhook
    createWebhook: protectedProcedure.input(z.object({
        accountId: z.string(),
        notificationUrl: z.string()
    })).mutation(async ({ ctx, input }) => {
        // 根据accountId和userId授权账户访问
        const acc = await authoriseAccountAccess(input.accountId, ctx.auth.userId)
        // 创建Account实例
        const account = new Account(acc.token)
        // 调用createWebhook方法创建webhook
        return await account.createWebhook('/email/messages', input.notificationUrl)
    }),
    // 删除webhook
    deleteWebhook: protectedProcedure.input(z.object({
        accountId: z.string(),
        webhookId: z.string()
    })).mutation(async ({ ctx, input }) => {
        // 根据accountId和userId授权账户访问
        const acc = await authoriseAccountAccess(input.accountId, ctx.auth.userId)
        // 创建Account实例
        const account = new Account(acc.token)
        // 调用deleteWebhook方法删除webhook
        return await account.deleteWebhook(input.webhookId)
    })
})