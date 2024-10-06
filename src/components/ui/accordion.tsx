/**
 * 使用客户端渲染，确保组件在客户端进行渲染
 */
"use client"

// 导入React库和Radix UI的Accordion组件及图标
import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "@radix-ui/react-icons"

// 导入实用工具函数
import { cn } from "@/lib/utils"

// 重新导出Accordion组件根实例
const Accordion = AccordionPrimitive.Root

/**
 * AccordionItem组件，封装了Radix UI的Accordion.Item组件，添加了额外的样式和属性
 * @param props 组件属性，包括className和其他AccordionPrimitive.Item组件支持的属性
 * @param ref 用于聚焦和Ref相关操作
 * @returns 返回一个带有自定义样式和传递属性的AccordionPrimitive.Item组件
 */
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

/**
 * AccordionTrigger组件，封装了Radix UI的Accordion.Trigger组件，添加了额外的样式和属性
 * @param props 组件属性，包括className、children和其他AccordionPrimitive.Trigger组件支持的属性
 * @param ref 用于聚焦和Ref相关操作
 * @returns 返回一个带有自定义样式和传递属性的AccordionPrimitive.Trigger组件，包含一个旋转的ChevronDownIcon
 */
// 定义一个名为AccordionTrigger的组件，该组件是React.forwardRef的返回类型和参数类型
// 它接收一个包含className、children等属性的对象和一个ref，并返回一个React元素
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  // AccordionPrimitive.Header用于包裹整个 accordion 的头部
  <AccordionPrimitive.Header className="flex">
    // AccordionPrimitive.Trigger用于触发 accordion 的展开和收起
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      // ChevronDownIcon是一个向下指的 Chevron 图标，用于指示 accordion 的展开状态
      <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

/**
 * AccordionContent组件，封装了Radix UI的Accordion.Content组件，添加了额外的样式和动画
 * @param props 组件属性，包括className、children和其他AccordionPrimitive.Content组件支持的属性
 * @param ref 用于聚焦和Ref相关操作
 * @returns 返回一个带有自定义样式和传递属性的AccordionPrimitive.Content组件，应用了动画
 */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

// 导出Accordion、AccordionItem、AccordionTrigger和AccordionContent组件
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }