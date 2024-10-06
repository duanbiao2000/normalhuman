// 导入zod库
import { z } from "zod";

// 导入createTRPCRouter和publicProcedure函数
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// 创建postRouter路由
export const postRouter = createTRPCRouter({
  // 定义hello函数，输入参数为text，输出为greeting
  hello: publicProcedure
    .input(z.object({ text: z.string() })) // 输入参数为text，类型为字符串
    .query(({ input }) => { // 输入参数为input
      return {
        greeting: `Hello ${input.text}`, // 输出为greeting，值为Hello + input.text
      };
    }),

  // 定义create函数，输入参数为name，输出为创建的post
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) })) // 输入参数为name，类型为字符串，最小长度为1
    .mutation(async ({ ctx, input }) => { // 输入参数为ctx和input
      return ctx.db.post.create({ // 创建post
        data: {
          name: input.name, // 输入参数为name
        },
      });
    }),

  // 定义getLatest函数，输出为最新的post
  getLatest: publicProcedure.query(async ({ ctx }) => { // 输入参数为ctx
    const post = await ctx.db.post.findFirst({ // 查找最新的post
      orderBy: { createdAt: "desc" }, // 按照创建时间降序排列
    });

    return post ?? null; // 返回post，如果没有找到则返回null
  }),
});