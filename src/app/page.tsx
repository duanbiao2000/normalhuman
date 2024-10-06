import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/theme-toggle"
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'

const LandingPage = async () => {
    const { userId } = auth()
    if (userId) {
        return redirect('/mail')
    }
    // 返回一个React组件，用于展示一个邮件客户端的主页
return (
    <>
        {/* <div className="h-screen w-full bg-white absolute inset-0">
        </div> */}
        // 创建一个绝对定位的背景div，使用CSS渐变和遮罩效果来实现特定的视觉效果
        <div className="absolute z-[-1] bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_80%)]">
        </div>
        // 主要内容区域，使用flex布局和相对定位来确保内容的垂直居中和水平居中
        <div className="min-h-screen flex flex-col items-center pt-56 relative z-[10]">
            // 标题，使用CSS属性实现从灰色到黑色的渐变效果，以及文本的透明背景剪切
            <h1 className="bg-gradient-to-r text-center from-gray-600 font-bold text-6xl to-gray-900 inline-block text-transparent bg-clip-text">
                The minimalistic, <br />AI-powered email client.
            </h1>
            <div className="h-4"></div>
            // 副标题，简要介绍邮件客户端的特点和优势
            <p className="text-xl mb-8 text-gray-600 max-w-xl text-center">
                Normal Human is a minimalistic, AI-powered email client that empowers you to manage your email with ease.
            </p>
            // 操作按钮区域，提供“开始使用”和“了解更多”的链接
            <div className="space-x-4">
                <Button>
                    <Link href="/mail">Get Started</Link>
                </Button>
                <Link href='https://start-saas.com?utm=normalhuman'>
                    <Button variant="outline" >Learn More</Button>
                </Link>
            </div>
            // 特性介绍区域，突出AI驱动的邮件分类、全文搜索和快捷键界面等特性
            <div className="mt-12 max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-center">Experience the power of:</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white border rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-2">AI-driven email RAG</h3>
                        <p className="text-gray-600">Automatically prioritize your emails with our advanced AI system.</p>
                    </div>
                    <div className="bg-white border rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-2">Full-text search</h3>
                        <p className="text-gray-600">Quickly find any email with our powerful search functionality.</p>
                    </div>
                    <div className="bg-white border rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-2">Shortcut-focused interface</h3>
                        <p className="text-gray-600">Navigate your inbox efficiently with our intuitive keyboard shortcuts.</p>
                    </div>
                </div>
            </div>
            // 展示邮件客户端的演示图片，使用CSS过渡效果提升用户交互体验
            <Image src='/demo.png' alt='demo' width={1000} height={1000} className='my-12 border rounded-md transition-all hover:shadow-2xl hover:scale-[102%] shadow-xl w-[70vw] h-auto' />
            // 页面底部区域，提供登录、注册和模式切换的链接
            <div className="flex items-center space-x-4 mb-10">
                <Link href="/sign-in" className="text-sm hover:underline">Sign In</Link>
                <Link href="/sign-up" className="text-sm hover:underline">Sign Up</Link>
                <ModeToggle />
            </div>
        </div>
    </>
)
}

export default LandingPage