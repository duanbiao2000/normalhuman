'use client'
import Avatar from 'react-avatar';
import { Letter } from 'react-letter';
import { api, type RouterOutputs } from '@/trpc/react'
import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import useThreads from '../use-threads';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

// 定义Props类型，它是一个对象，包含一个email属性，email属性的值是RouterOutputs['mail']['getThreads'][number]['emails'][number]类型
type Props = {
    email: RouterOutputs['mail']['getThreads'][number]['emails'][number]
}

/**
 * 邮件显示组件
 * 
 * 该组件用于显示邮件信息，包括发件人头像、邮件地址和发送时间，并根据邮件是否由当前用户发送调整显示样式
 * 
 * @param {Props} props - 组件的props类型，包含email信息
 * @returns {JSX.Element} - 返回邮件显示的JSX结构
 */
const EmailDisplay = ({ email }: Props) => {
    // 使用useThreads钩子获取当前用户的账户信息
    const { account } = useThreads();
    // 使用Ref来引用邮件内容的容器元素
    const letterRef = React.useRef<HTMLDivElement>(null);

    /**
     * 当邮件内容变化时，移除gmail引用内容
     * React.useEffect钩子用于在email值改变时，清除gmail引用的内容
     * 如果letterRef.current存在，则查找并清空gmail引用内容
     */
    React.useEffect(() => {
        if (letterRef.current) {
            const gmailQuote = letterRef.current.querySelector('div[class*="_gmail_quote"]');
            if (gmailQuote) {
                gmailQuote.innerHTML = '';
            }
        }
    }, [email]);

    // 判断当前邮件是否由当前用户发送
    const isMe = account?.emailAddress === email.from.address;

    // 返回邮件信息的显示结构
    return (
        <div className={cn('border rounded-md p-4 cursor-pointer transition-all  hover:translate-x-2', {
            'border-l-gray-900 border-l-4': isMe
        })} ref={letterRef}>
            <div className="flex items-center justify-between gap-2">
                <div className='flex items-center gap-2'>
                    {!isMe && <Avatar name={email.from.name ?? email.from.address} email={email.from.address} size='35' textSizeRatio={2} round={true} />}
                    <span className='font-medium'>
                        {isMe ? 'Me' : email.from.address}
                    </span>
                </div>
                <p className='text-xs text-muted-foreground'>
                    {formatDistanceToNow(email.sentAt ?? new Date(), {
                        addSuffix: true,
                    })}
                </p>
            </div>
            <div className="h-4"></div>
            <Letter className='bg-white rounded-md text-black' html={email?.body ?? ""} />
        </div>
    )
}

export default EmailDisplay