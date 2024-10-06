/**
 * 使用客户端渲染，这是Next.js 13引入的一种渲染模式，用于优化性能和SEO
 */
"use client"

// 导入React库，用于构建用户界面
import * as React from "react"
// 导入Next.js的主题提供者，用于管理明暗模式
import { ThemeProvider as NextThemesProvider } from "next-themes"
// 导入主题提供者的类型定义，以便在编写组件时提供类型安全
import { type ThemeProviderProps } from "next-themes/dist/types"

/**
 * 主题提供者组件，用于封装Next.js的主题提供者功能
 * @param {ThemeProviderProps} props - 组件的props，包含主题提供者所需的所有属性
 * @param {React.ReactNode} children - 需要使用主题提供者功能的子组件
 * @returns {JSX.Element} - 返回一个NextThemesProvider组件，其中包含子组件和传递的props
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}