'use client'
import {
    type Action,
    KBarProvider,
    KBarPortal,
    KBarPositioner,
    KBarAnimator,
    KBarSearch,
    Priority,
} from "kbar";
import RenderResults from "./RenderResult";
import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useLocalStorage } from "usehooks-ts";
import { usePathname, useRouter } from "next/navigation";
import useAccountSwitching from "./use-account-switching";
import useThemeSwitching from "./use-theme-switching";
import { useAtom } from "jotai";
import { isSearchingAtom } from "../search-bar";
import { useThread } from "../../use-thread";


// 导出一个默认函数KBar，接收一个参数children，类型为React.ReactNode
export default function KBar({ children }: { children: React.ReactNode }) {
    // 使用jotai库中的useAtom函数获取isSearchingAtom的值，并设置setIsSearching函数
    const [isSearching, setIsSearching] = useAtom(isSearchingAtom)
    // 使用usehooks-ts库中的useLocalStorage函数获取normalhuman-tab的值，并设置setTab函数
    const [_, setTab] = useLocalStorage(`normalhuman-tab`, 'inbox')
    // 使用自定义的useThread函数获取threadId的值，并设置setThreadId函数
    const [threadId, setThreadId] = useThread()
    // 使用usehooks-ts库中的useLocalStorage函数获取normalhuman-done的值，并设置setDone函数
    const [done, setDone] = useLocalStorage('normalhuman-done', false)

    // 定义一个actions数组，包含多个Action对象
    const actions: Action[] = [
        {
            id: "inboxAction",
            name: "Inbox",
            shortcut: ["g", 'i'],
            keywords: "inbox",
            section: "Navigation",
            subtitle: "View your inbox",
            perform: () => {
                setTab('inbox')
            },
        },
        {
            id: "draftsAction",
            name: "Drafts",
            shortcut: ['g', 'd'],
            keywords: "drafts",
            priority: Priority.HIGH,
            subtitle: "View your drafts",
            section: "Navigation",
            perform: () => {
                setTab('drafts')
            },
        },
        {
            id: "sentAction",
            name: "Sent",
            shortcut: ['g', "s"],
            keywords: "sent",
            section: "Navigation",
            subtitle: "View the sent",
            perform: () => {
                setTab('sent')
            },
        },
        {
            id: "pendingAction",
            name: "See done",
            shortcut: ['g', "d"],
            keywords: "done",
            section: "Navigation",
            subtitle: "View the done emails",
            perform: () => {
                setDone(true)
            },
        },
      {
    // 标识该操作的唯一ID
    id: "doneAction",
    // 操作的名称
    name: "See Pending",
    // 快捷键，用于快速触发该操作
    shortcut: ['g', "u"],
    // 操作相关的关键词，用于搜索或触发建议
    keywords: 'pending, undone, not done',
    // 操作所属的类别
    section: "Navigation",
    // 操作的子标题，提供额外的信息
    subtitle: "View the pending emails",
    // 执行该操作的函数
    perform: () => {
        // 将所有邮件标记为未读
        setDone(false)
    },
}
    ];
    // 返回一个KBarProvider组件，包含actions和children
    return (
        <KBarProvider actions={actions}>
            <ActualComponent>
                {children}
            </ActualComponent>
        </KBarProvider>
    )
}
// 定义一个ActualComponent组件，接收一个参数children，类型为React.ReactNode
const ActualComponent = ({ children }: { children: React.ReactNode }) {

    // 使用自定义的useAccountSwitching函数
    useAccountSwitching()
    // 使用自定义的useThemeSwitching函数
    useThemeSwitching()


    // 返回一个包含KBarPortal、KBarPositioner、KBarAnimator、KBarSearch和RenderResults组件的组件
    return (
        <>
            <KBarPortal>
                <KBarPositioner className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm scrollbar-hide !p-0 z-[99999]">
                    <KBarAnimator className="max-w-[600px] !mt-64 w-full bg-white dark:bg-gray-800 text-foreground dark:text-gray-200 shadow-lg border dark:border-gray-700 rounded-lg overflow-hidden relative !-translate-y-12">
                        <div className="bg-white dark:bg-gray-800">
                            <div className="border-x-0 border-b-2 dark:border-gray-700">
                                <KBarSearch className="py-4 px-6 text-lg w-full bg-white dark:bg-gray-800 outline-none border-none focus:outline-none focus:ring-0 focus:ring-offset-0" />
                            </div>
                            <RenderResults />
                        </div>
                    </KBarAnimator>
                </KBarPositioner>
            </KBarPortal>
            {children}
        </>
    )
}