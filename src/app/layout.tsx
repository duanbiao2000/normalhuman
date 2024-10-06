// 导入全局样式
import "@/styles/globals.css";
// 导入Kbar组件
import Kbar from "@/app/mail/components/kbar";
// 导入ClerkProvider
import { ClerkProvider } from "@clerk/nextjs";

// 导入GeistSans字体
import { GeistSans } from "geist/font/sans";
// 导入Metadata类型
import { type Metadata } from "next";

// 导入TRPCReactProvider
import { TRPCReactProvider } from "@/trpc/react";
// 导入ThemeProvider
import { ThemeProvider } from "@/components/theme-provicer";
// 导入Toaster
import { Toaster } from "sonner";

// 定义metadata
export const metadata: Metadata = {
  title: "Normal Human",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// 定义RootLayout组件
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <TRPCReactProvider>
              <Kbar>
                {children}
              </Kbar>
            </TRPCReactProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}