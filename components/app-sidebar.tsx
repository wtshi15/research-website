"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Home, ClipboardCheck, MessageSquare, ThumbsUp } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  // Explicit per-page completion state
  const [homeComplete, setHomeComplete] = useState(true) // Always true
  const [surveyComplete, setSurveyComplete] = useState(false)
  const [chatComplete, setChatComplete] = useState(false)
  const [survey2Complete, setSurvey2Complete] = useState(false)
  const [thankYouComplete, setThankYouComplete] = useState(false)

  useEffect(() => {
    const fromStorage = (key: string) => localStorage.getItem(key) === "true"

    setSurveyComplete(fromStorage("surveyComplete"))
    setChatComplete(fromStorage("chatComplete"))
    setSurvey2Complete(fromStorage("survey2Complete"))
    setThankYouComplete(fromStorage("thankYouComplete"))

    const updatePageState = (key: string, setter: (v: boolean) => void) => {
      localStorage.setItem(key, "true")
      setter(true)
    }

    if (pathname === "/survey") updatePageState("surveyComplete", setSurveyComplete)
    if (pathname === "/chat") updatePageState("chatComplete", setChatComplete)
    if (pathname === "/survey-2") updatePageState("survey2Complete", setSurvey2Complete)
    if (pathname === "/thank-you") updatePageState("thankYouComplete", setThankYouComplete)
  }, [pathname])

  const menuItems = [
    {
      title: "Home",
      href: "/",
      icon: Home,
      isEnabled: homeComplete,
    },
    {
      title: "Initial Survey",
      href: "/survey",
      icon: ClipboardCheck,
      isEnabled: surveyComplete,
    },
    {
      title: "Chat",
      href: "/chat",
      icon: MessageSquare,
      isEnabled: chatComplete,
    },
    {
      title: "Follow-up Survey",
      href: "/survey-2",
      icon: ClipboardCheck,
      isEnabled: survey2Complete,
    },
    {
      title: "Thank You",
      href: "/thank-you",
      icon: ThumbsUp,
      isEnabled: thankYouComplete,
    },
  ]

  return (
    <Sidebar collapsible="none">
      <SidebarHeader className="flex items-center justify-center p-4">
        <h2 className="text-lg font-semibold">Research Project</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const isDisabled = !item.isEnabled && !isActive

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
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
