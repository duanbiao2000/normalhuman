// 导入PrismaClient
import { PrismaClient } from "@prisma/client";

// 导入环境变量
import { env } from "@/env";

// 创建PrismaClient实例
const createPrismaClient = () =>
  new PrismaClient({
    // 如果环境变量NODE_ENV为development，则记录error和warn级别的日志，否则只记录error级别的日志
    log:
      env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// 创建一个全局变量，用于存储PrismaClient实例
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// 如果全局变量中没有PrismaClient实例，则创建一个新的实例
export const db = globalForPrisma.prisma ?? createPrismaClient();

// 如果环境变量NODE_ENV不是production，则将PrismaClient实例存储到全局变量中
if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;