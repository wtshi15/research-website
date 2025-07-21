"use client"

import { Home, MessageSquare, ClipboardCheck, ThumbsUp, Lock } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Home",
    icon: Home,
    href: "/",
    order: 0,
  },
  {
    title: "Initial Survey",
    icon: ClipboardCheck,
    href: "/survey",
    order: 1,
  },
  {
    title: "Chat",
    icon: MessageSquare,
    href: "/chat",
    order: 2,
  },
  {
    title: "Follow-up Survey",
    icon: ClipboardCheck,
    href: "/survey-2",
    order: 3,
  },
  {
    title: "Thank You",
    icon: ThumbsUp,
    href: "/thank-you",
    order: 4,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [completedSteps, setCompletedSteps] = useState<number[]>([0]) // Home is always completed
  const [isAdmin, setIsAdmin] = useState(false)

  // Update completed steps based on current path
  useEffect(() => {
    // Find the current page order
    const currentPage = menuItems.find((item) => item.href === pathname)
    if (currentPage) {
      // Get the current order
      const currentOrder = currentPage.order

      // Load from localStorage or initialize
      const storedSteps = localStorage.getItem("completedSteps")
      const steps = storedSteps ? JSON.parse(storedSteps) : [0]

      // Add current step if not already included
      if (!steps.includes(currentOrder)) {
        steps.push(currentOrder)
        localStorage.setItem("completedSteps", JSON.stringify(steps))
      }

      setCompletedSteps(steps)
    }

    // Check if user is logged in as admin
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    setIsAdmin(adminLoggedIn)
  }, [pathname])

  return (
    <Sidebar collapsible="none">
      <SidebarHeader className="flex items-center justify-center p-4">
        <h2 className="text-lg font-semibold">Research Project</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isCompleted = completedSteps.includes(item.order)
            const isActive = pathname === item.href
            const isDisabled = !isCompleted

            return (
              <SidebarMenuItem key={item.title}>
                {isDisabled ? (
                  <SidebarMenuButton className="opacity-50 cursor-not-allowed" isActive={isActive}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            )
          })}

          {/* Admin pages - only visible when logged in */}
          {isAdmin && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/home"}>
                  <Link href="/admin/home">
                    <Home className="h-5 w-5" />
                    <span>Edit Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/survey"}>
                  <Link href="/admin/survey">
                    <ClipboardCheck className="h-5 w-5" />
                    <span>Edit Initial Survey</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/chat"}>
                  <Link href="/admin/chat">
                    <MessageSquare className="h-5 w-5" />
                    <span>Edit Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/survey-2"}>
                  <Link href="/admin/survey-2">
                    <ClipboardCheck className="h-5 w-5" />
                    <span>Edit Follow-up Survey</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/thank-you"}>
                  <Link href="/admin/thank-you">
                    <ThumbsUp className="h-5 w-5" />
                    <span>Edit Thank You</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenuButton asChild isActive={pathname === "/login"}>
          <Link href="/login" className="w-full">
            <Lock className="h-5 w-5" />
            <span>{isAdmin ? "Admin Panel" : "Login"}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
