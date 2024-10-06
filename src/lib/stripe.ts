'server-only'
// 导入Stripe模块
import Stripe from 'stripe'

// 创建Stripe实例
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // 设置API版本
    apiVersion: '2024-06-20',
})

