"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

/**
 * 主题切换组件
 * 
 * 该组件允许用户在浅色模式和深色模式之间切换网站的主题
 * 它通过使用 useTheme 钩子来获取当前的主题，并在用户点击时切换主题
 */
export function ModeToggle() {
    // 使用 useTheme 钩子获取当前主题和设置主题的函数
    const { theme, setTheme } = useTheme()

    /**
     * 切换主题的函数
     * 
     * 根据当前主题是浅色还是深色，将主题设置为对方
     */
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    // 渲染一个按钮，根据当前主题显示不同的图标，并在点击时切换主题
    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
        >
            // 当前主题为浅色时显示太阳图标
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            // 当前主题为深色时显示月亮图标
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    )
}