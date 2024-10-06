//@ts-ignore
import { createKeybindingsHandler } from "tinykeys"
import { api, type RouterOutputs } from '@/trpc/react'
import { useQueryClient } from '@tanstack/react-query'
import { useRegisterActions } from 'kbar'
import React, { useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { useThread } from "../../use-thread"
import { atom, useAtom } from "jotai"
import { toast } from "sonner"
import { getQueryKey } from "@trpc/react-query"
import useRefetch from "@/hooks/use-refetch"
import useThreads from "../../use-threads"
import { isSearchingAtom } from "../search-bar"

// 定义visualModeAtom和visualModeStartIdAtom
export const visualModeAtom = atom(false)
export const visualModeStartIdAtom = atom<string | null>(null)

// 定义useVim函数
const useVim = () => {

    // 获取queryClient
    const queryClient = useQueryClient()
    // 获取当前线程id和设置线程id的函数
    const [threadId, setThreadId] = useThread()
    // 获取accountId
    const [accountId] = useLocalStorage('accountId', '')
    // 获取tab
    const [tab] = useLocalStorage('normalhuman-tab', 'inbox')
    // 获取done
    const [done] = useLocalStorage('normalhuman-done', false)
    // 获取threads数据
    const { threads: data, queryKey, refetch } = useThreads()

    // 定义setUndone函数，用于将线程标记为未完成
    const setUndone = api.mail.setUndone.useMutation({
        onMutate: async (payload) => {
            if (!payload.threadId && !payload.threadIds) return
            if (!done) return
            toast.success('Undone!')
            await queryClient.cancelQueries({ queryKey })
            const previousData = queryClient.getQueryData<RouterOutputs['mail']['getThreads']>(queryKey)
            queryClient.setQueryData(queryKey, (data: RouterOutputs['mail']['getThreads'] | undefined) => {
                if (!data) return data
                const threadIds = visualMode ? selectedThreadIds : [payload.threadId]
                const newData = data.filter(t => !threadIds.includes(t.id))

                if (visualMode) {
                    setVisualMode(false)
                    setVisualModeStartId(null)
                    const currentIndex = data.findIndex(t => t.id === threadIds.at(-1))
                    setThreadId(newData[currentIndex - threadIds.length + 1]?.id ?? null)
                } else {
                    const currentIndex = data.findIndex(t => t.id === threadId)
                    if (currentIndex !== -1 && threadIds.includes(threadId ?? '')) {
                        const nextThreadId = newData[currentIndex]?.id ?? newData[currentIndex - 1]?.id ?? null
                        setThreadId(nextThreadId)
                    }
                }

                return newData
            })
            return previousData
        },
        onSettled: () => {
            refetch()
        }
    })

    // 定义setDone函数，用于将线程标记为已完成
    const setDone = api.mail.setDone.useMutation({
        onMutate: async (payload) => {
            if (done) return
            if (!payload.threadId && !payload.threadIds) return
            toast.success('Done!')
            await queryClient.cancelQueries({ queryKey })
            const previousData = queryClient.getQueryData<RouterOutputs['mail']['getThreads']>(queryKey)
            queryClient.setQueryData(queryKey, (data: RouterOutputs['mail']['getThreads'] | undefined) => {
                if (!data) return data
                const threadIds = visualMode ? selectedThreadIds : [payload.threadId]
                const newData = data.filter(t => !threadIds.includes(t.id))

                if (visualMode) {
                    setVisualMode(false)
                    setVisualModeStartId(null)
                    const currentIndex = data.findIndex(t => t.id === threadIds.at(-1))
                    setThreadId(newData[currentIndex - threadIds.length + 1]?.id ?? null)
                } else {
                    const currentIndex = data.findIndex(t => t.id === threadId)
                    if (currentIndex !== -1 && threadIds.includes(threadId ?? '')) {
                        const nextThreadId = newData[currentIndex]?.id ?? newData[currentIndex - 1]?.id ?? null
                        setThreadId(nextThreadId)
                    }
                }

                return newData
            })
            return previousData
        },
        onSettled: () => {
            refetch()
        }
    })

    // 获取visualMode和设置visualMode的函数
    const [visualMode, setVisualMode] = useAtom(visualModeAtom)
    // 获取visualModeStartId和设置visualModeStartId的函数
    const [visualModeStartId, setVisualModeStartId] = useAtom(visualModeStartIdAtom)

    // 计算选中的线程id
    const selectedThreadIds = useMemo(() => {
        if (!visualMode || !visualModeStartId || !threadId || !data) return []

        const startIndex = data.findIndex(t => t.id === visualModeStartId)
        const endIndex = data.findIndex(t => t.id === threadId)

        if (startIndex === -1 || endIndex === -1) return []

        const start = Math.min(startIndex, endIndex)
        const end = Math.max(startIndex, endIndex)

        return data.slice(start, end + 1).map(t => t.id)
    }, [visualMode, visualModeStartId, threadId, data])

    // 定义numberRef，用于存储选中的线程数量
    const numberRef = React.useRef(0)

    // 监听selectedThreadIds的变化，更新numberRef的值
    React.useEffect(() => {
        numberRef.current = selectedThreadIds.length
    }, [selectedThreadIds])

    // 监听visualMode和selectedThreadIds的变化，显示或隐藏toast
    React.useEffect(() => {
        if (visualMode) {
            toast.info(`${numberRef.current} thread${numberRef.current !== 1 ? 's' : ''} selected`, {
                id: 'visual-mode-toast',
                duration: Infinity,
                position: 'bottom-center'
            });
        } else {
            toast.dismiss('visual-mode-toast');
        }
    }, [visualMode, selectedThreadIds]);

    // 监听threadId的变化，将当前线程滚动到视图中
    React.useEffect(() => {
        if (!threadId) return
        // move thread it into view 
        const element = document.getElementById(`thread-${threadId}`)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [threadId])


    // 定义isInputElement函数，用于判断当前元素是否为输入元素
    const isInputElement = (element: Element | null): boolean => {
        return !!(element instanceof HTMLInputElement ||
            element instanceof HTMLTextAreaElement ||
            element instanceof HTMLSelectElement ||
            element?.hasAttribute('contenteditable'));
    };

    // 定义handler函数，用于处理键盘事件
    let handler = (event: KeyboardEvent) => {
        if (isInputElement(document.activeElement)) {
            return;
        }

        return createKeybindingsHandler({
            "j": () => {
                // Move cursor down
                if (data && data.length > 0) {
                    if (!threadId) {
                        setThreadId(data[0]!.id)
                        return
                    }
                    const currentIndex = data.findIndex(t => t.id === threadId);
                    if (currentIndex < data.length - 1) {
                        const nextId = data[currentIndex + 1]!.id
                        setThreadId(nextId)
                    }
                }
            },
            "k": () => {
                // Move cursor up
                if (data && data.length > 0) {
                    if (!threadId) {
                        setThreadId(data[0]!.id)
                        return
                    }
                    const currentIndex = data.findIndex(t => t.id === threadId);
                    if (currentIndex > 0) {
                        const prevId = data[currentIndex - 1]!.id
                        setThreadId(prevId)
                    }
                }
            },
            "g g": () => {
                // Move to the first thread
                if (data && data.length > 0) {
                    const firstId = data[0]!.id
                    setThreadId(firstId)
                }
            },
            "Shift+G": () => {
                // Move to the last thread
                if (data && data.length > 0) {
                    const lastId = data[data.length - 1]!.id
                    setThreadId(lastId)
                }
            },
            "Shift+V": () => {
                setVisualMode(true)
                if (!threadId) return
                setVisualModeStartId(threadId)
            },
            "Escape": () => {
                setVisualMode(false)
                setVisualModeStartId(null)
            },
            "d": () => {
                if (done) return
                if (!threadId || !selectedThreadIds) return
                if (visualMode) {
                    setDone.mutate({ accountId, threadIds: selectedThreadIds })
                } else {
                    setDone.mutate({ accountId, threadId })
                }
            },
            "u": () => {
                if (!done) return
                if (!threadId || !selectedThreadIds) return
                if (visualMode) {
                    setUndone.mutate({ accountId, threadIds: selectedThreadIds })
                } else {
                    setUndone.mutate({ accountId, threadId })
                }
            }
        })(event);
    };

    // 监听handler、threadId、data、visualMode和visualModeStartId的变化，添加或移除键盘事件监听
    React.useEffect(() => {
        if (typeof window == 'undefined') return
        window.addEventListener("keydown", handler)
        return () => {
            window.removeEventListener("keydown", handler)
        }
    }, [handler, threadId, data, visualMode, visualModeStartId])

    // 返回选中的线程id和visualMode
    return { selectedThreadIds, visualMode }
}

// 导出useVim函数
export default useVim