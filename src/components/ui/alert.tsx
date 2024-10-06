// 导入React和class-variance-authority库
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

// 导入cn函数
import { cn } from "@/lib/utils"

// 定义alertVariants变量，使用cva函数创建一个可变类名
// 定义alertVariants变量，用于定义不同类名的样式
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    // 定义variants变量，用于定义不同类名的样式
    variants: {
      variant: {
        // 默认样式
        default: "bg-background text-foreground",
        // 毁坏样式
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    // 定义defaultVariants变量，用于定义默认的类名
    defaultVariants: {
      variant: "default",
    },
  }
)

// 定义Alert组件，使用React.forwardRef函数创建一个可引用的组件
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  // 返回一个div元素，设置ref、role、className和props属性
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
// 设置Alert组件的displayName属性
Alert.displayName = "Alert"

// 定义AlertTitle组件，使用React.forwardRef函数创建一个可引用的组件
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  // 返回一个h5元素，设置ref、className和props属性
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
// 设置AlertTitle组件的displayName属性
AlertTitle.displayName = "AlertTitle"

// 定义AlertDescription组件，使用React.forwardRef函数创建一个可引用的组件
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  // 返回一个div元素，设置ref、className和props属性
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
// 设置AlertDescription组件的displayName属性
AlertDescription.displayName = "AlertDescription"

// 导出Alert、AlertTitle和AlertDescription组件
export { Alert, AlertTitle, AlertDescription }