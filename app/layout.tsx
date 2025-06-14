import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ProgressProvider } from "@/components/progress-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Research Project",
  description: "Research project survey and chat application",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ProgressProvider>
            <SidebarProvider defaultOpen={true}>
              <div className="flex min-h-screen">
                <AppSidebar />
                <main className="flex-1 flex items-start justify-center p-6 overflow-y-auto">
                  <div className="w-full max-w-4xl">{children}</div>
                </main>
              </div>
            </SidebarProvider>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
