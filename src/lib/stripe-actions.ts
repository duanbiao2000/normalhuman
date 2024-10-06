'use server'

// 导入Clerk的auth模块，用于验证用户身份
import { auth } from "@clerk/nextjs/server";
// 导入stripe模块，用于与Stripe API进行交互
import { stripe } from "./stripe";
// 导入next/navigation模块，用于重定向
import { redirect } from "next/navigation";
// 导入数据库模块，用于查询数据库
import { db } from "@/server/db";

// 创建Stripe checkout session
export async function createCheckoutSession() {
    // 获取当前用户ID
    const { userId } = await auth();

    // 如果用户不存在，抛出错误
    if (!userId) {
        throw new Error('User not found');
    }

    // 创建Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        // 支付方式
        payment_method_types: ['card'],
        // 商品信息
        line_items: [
            {
                // 商品价格ID
                price: process.env.STRIPE_PRICE_ID,
                // 商品数量
                quantity: 1,
            },
        ],
        // 模式
        mode: 'subscription',
        // 支付成功后的跳转URL
        success_url: `${process.env.NEXT_PUBLIC_URL}/mail`,
        // 支付取消后的跳转URL
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
        // 客户端引用ID
        client_reference_id: userId.toString(),
    });

    // 重定向到Stripe checkout session的URL
    redirect(session.url!);
}

// 创建Stripe billing portal session
export async function createBillingPortalSession() {
    // 获取当前用户ID
    const { userId } = await auth();
    // 如果用户不存在，返回false
    if (!userId) {
        return false
    }
    // 查询用户对应的Stripe subscription
    const subscription = await db.stripeSubscription.findUnique({
        where: { userId: userId },
    });
    // 如果subscription不存在，抛出错误
    if (!subscription?.customerId) {
        throw new Error('Subscription not found');
    }
    // 创建Stripe billing portal session
    const session = await stripe.billingPortal.sessions.create({
        // 客户ID
        customer: subscription.customerId,
        // 返回URL
        return_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    });
    // 重定向到Stripe billing portal session的URL
    redirect(session.url!)
}

// 获取用户订阅状态
export async function getSubscriptionStatus() {
    // 获取当前用户ID
    const { userId } = await auth();
    // 如果用户不存在，返回false
    if (!userId) {
        return false
    }
    // 查询用户对应的Stripe subscription
    const subscription = await db.stripeSubscription.findUnique({
        where: { userId: userId },
    });
    // 如果subscription不存在，返回false
    if (!subscription) {
        return false;
    }
    // 返回订阅是否过期
    return subscription.currentPeriodEnd > new Date();
}