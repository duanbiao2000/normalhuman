"use client"

// 导入React和AvatarPrimitive
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

// 导入cn函数
import { cn } from "@/lib/utils"

// 定义Avatar组件
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>, // 定义Avatar组件的ref类型
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> // 定义Avatar组件的props类型
>(({ className, ...props }, ref) => ( // 定义Avatar组件的props和ref
  <AvatarPrimitive.Root
    ref={ref} // 将ref传递给AvatarPrimitive.Root
    className={cn( // 使用cn函数合并className
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", // 默认的className
      className // 传入的className
    )}
    {...props} // 传入的props
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName // 设置Avatar组件的displayName

// 定义AvatarImage组件
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>, // 定义AvatarImage组件的ref类型
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> // 定义AvatarImage组件的props类型
>(({ className, ...props }, ref) => ( // 定义AvatarImage组件的props和ref
  <AvatarPrimitive.Image
    ref={ref} // 将ref传递给AvatarPrimitive.Image
    className={cn("aspect-square h-full w-full", className)} // 使用cn函数合并className
    {...props} // 传入的props
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName // 设置AvatarImage组件的displayName

// 定义AvatarFallback组件
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>, // 定义AvatarFallback组件的ref类型
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> // 定义AvatarFallback组件的props类型
>(({ className, ...props }, ref) => ( // 定义AvatarFallback组件的props和ref
  <AvatarPrimitive.Fallback
    ref={ref} // 将ref传递给AvatarPrimitive.Fallback
    className={cn( // 使用cn函数合并className
      "flex h-full w-full items-center justify-center rounded-full bg-muted", // 默认的className
      className // 传入的className
    )}
    {...props} // 传入的props
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName // 设置AvatarFallback组件的displayName

// 导出Avatar、AvatarImage和AvatarFallback组件
export { Avatar, AvatarImage, AvatarFallback }