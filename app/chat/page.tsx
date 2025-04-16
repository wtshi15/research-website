"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { useProgress } from "@/components/progress-provider"
import { sendChatMessage } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const hasInitialized = useRef(false)

  const router = useRouter()
  const { toast } = useToast()
  const { markStepCompleted, sessionId, surveyResponse, chatHistory, addChatMessage } = useProgress()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Redirect if no session ID or survey response
  useEffect(() => {
    if (!sessionId || !surveyResponse) {
      toast({
        title: "Error",
        description: "Please complete the survey first",
        variant: "destructive",
      })
      router.push("/survey")
    }
  }, [sessionId, surveyResponse, router, toast])

  // Initialize messages
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true
  
    if (chatHistory.length > 0) {
      setMessages(
        chatHistory.map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        }))
      )
      setTurnCount(Math.floor(chatHistory.length / 2))
    } else if (surveyResponse) {
      const initialMessage = {
        role: "assistant",
        content: `What is your favorite part about getting your news from ${surveyResponse}?`,
      }
      setMessages([initialMessage])
      addChatMessage("assistant", initialMessage.content)
    }
  }, [surveyResponse, chatHistory, addChatMessage])
  

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !sessionId) return

    // Add user message
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    addChatMessage("user", input)
    setInput("")
    setIsLoading(true)

    try {
      // Send message to backend
      const response = await sendChatMessage(sessionId, input)

      const newTurnCount = turnCount + 1
      setTurnCount(newTurnCount)

      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: response.response,
      }
      setMessages((prev) => [...prev, assistantMessage])
      addChatMessage("assistant", response.response)

      // If we've reached the end of the conversation (3-5 turns), enable the next button
      if (newTurnCount >= 3) {
        markStepCompleted("chat")
        setTimeout(() => {
          router.push("/survey-2")
        }, 3000)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-10 h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat with our AI Assistant</CardTitle>
        <CardDescription>Please engage in a brief conversation about your news consumption habits.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <Avatar className={message.role === "user" ? "bg-primary" : "bg-muted"}>
                  <AvatarFallback>{message.role === "user" ? "U" : "AI"}</AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <Avatar className="bg-muted">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-100"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="w-full flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading || turnCount >= 3}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim() || turnCount >= 3}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
