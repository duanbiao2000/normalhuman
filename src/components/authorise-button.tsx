'use client'

// 导入必要的组件和函数
import { Button } from "@/components/ui/button"
import { getAurinkoAuthorizationUrl } from "@/lib/aurinko"
import { api } from "@/trpc/react"
import { useLocalStorage } from "usehooks-ts"

/**
 * AuthoriseButton 组件用于提供用户授权和同步邮件的功能
 * 它包含两个按钮，一个用于同步用户邮件，另一个用于引导用户到授权页面
 */
export default function AuthoriseButton() {
    // 使用 TRPC 的 useMutation 钩子来调用同步邮件的 API
    const syncEmails = api.mail.syncEmails.useMutation()
    // 使用本地存储钩子来存储和获取用户账号ID
    const [accountId, setAccountId] = useLocalStorage('accountId', '')

    return (
        <div className="flex flex-col gap-2">
            // 同步邮件按钮
            <Button size='sm' variant={'outline'} onClick={() => {
                // 当点击按钮时，如果 accountId 存在，则调用 syncEmails API
                if (!accountId) return
                syncEmails.mutate({ accountId })
            }}>
                Sync Emails
            </Button>
            // 邮件授权按钮
            <Button size='sm' variant={'outline'} onClick={async () => {
                // 当点击按钮时，获取 Google 授权的 URL 并重定向用户到该 URL
                const url = await getAurinkoAuthorizationUrl('Google')
                window.location.href = url
            }}>
                Authorize Email
            </Button>
        </div>
    )
}
