import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

/**
 * 定义免认证的公开路由列表
 * 这些路由允许用户在未登录状态下访问，主要用于用户注册、登录以及一些公开的API接口
 */
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)', // 用户登录页面及其相关子路径
  '/sign-up(.*)', // 用户注册页面及其相关子路径
  '/api/webhooks(.*)', // 公开的Webhooks API端点
  '/api/initial-sync(.*)', // 初始同步数据的API端点
  '/api/aurinko/webhook(.*)', // 特定服务Aurinko的Webhook端点
  '/api/stripe(.*)', // 与支付相关的Stripe API端点
  '/privacy', // 隐私政策页面
  '/terms-of-service' // 服务条款页面
])

// 出口默认的Clerk中间件配置
export default clerkMiddleware((auth, req) => {
  // 非公开路由则进行权限保护
  if (!isPublicRoute(req)) {
    auth().protect()
  }
})

// 配置中间件的匹配规则
export const config = {
  matcher: [
    // 跳过Next.js内部文件和所有静态文件，除非它们在查询参数中出现
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // API路由始终执行中间件
    '/(api|trpc)(.*)',
  ],
};