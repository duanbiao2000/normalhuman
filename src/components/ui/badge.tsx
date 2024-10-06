// 导入React库
import * as React from "react"
// 导入class-variance-authority库
import { cva, type VariantProps } from "class-variance-authority"

// 导入utils库中的cn函数
import { cn } from "@/lib/utils"

// 定义badgeVariants变量，使用cva函数创建一个可变类名
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    // 定义variants变量，用于定义不同类名的样式
    variants: {
      variant: {
        // 默认样式
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        // 第二种样式
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // 第三种样式
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        // 第四种样式
        outline: "text-foreground",
      },
    },
    // 定义defaultVariants变量，用于定义默认的类名
    defaultVariants: {
      variant: "default",
    },
  }
)

// 定义BadgeProps接口，继承React.HTMLAttributes<HTMLDivElement>和VariantProps<typeof badgeVariants>
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

// 定义Badge函数，接收BadgeProps类型的参数
function Badge({ className, variant, ...props }: BadgeProps) {
  // 返回一个div元素，使用cn函数将badgeVariants和className合并，并传入props
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// 导出Badge和badgeVariants
export { Badge, badgeVariants }