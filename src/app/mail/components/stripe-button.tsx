'use client'
import { Button } from '@/components/ui/button'
import { createBillingPortalSession, createCheckoutSession, getSubscriptionStatus } from '@/lib/stripe-actions'
import React from 'react'

// 定义一个名为StripeButton的函数组件
const StripeButton = () => {
    // 初始化状态变量isSubscribed，用于判断用户是否已订阅
    const [isSubscribed, setIsSubscribed] = React.useState(false)

    // 在组件挂载后异步获取用户的订阅状态
    React.useEffect(() => {
        (async () => {
            const isSubscribed = await getSubscriptionStatus()
            setIsSubscribed(isSubscribed)
        })()
    }, [])

    // 定义点击按钮后的处理函数
    const handleClick = async () => {
        // 如果用户未订阅，则创建新的结账会话
        if (!isSubscribed) {
            await createCheckoutSession()
        } else {
            // 如果用户已订阅，则创建账单门户会话，允许用户管理订阅
            await createBillingPortalSession()
        }
    }

    // 渲染按钮组件，根据isSubscribed状态显示不同的文本
    return (
        <Button variant={'outline'} size='lg' onClick={handleClick}>{isSubscribed ? 'Manage Subscription' : 'Upgrade Plan'}</Button>
    )
}

export default StripeButton