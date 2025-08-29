"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send } from 'lucide-react'

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [newsSource, setNewsSource] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const [sessionId, setSessionId] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Content state
  const [title, setTitle] = useState("Chat with our AI Assistant")
  const [description, setDescription] = useState(
    "Please engage in a brief conversation about your news consumption habits.",
  )
  const [initialMessage, setInitialMessage] = useState(
    "What is your favorite part about getting your news from {newsSource}?",
  )
  const [maxTurns, setMaxTurns] = useState(3)
  const [finalMessage, setFinalMessage] = useState(
    "Thank you for sharing your thoughts! We've completed this part of the study. Let's move on to the next section.",
  )
  const [predefinedResponses, setPredefinedResponses] = useState([
    "That's interesting! How often do you consume news from {newsSource}?",
    "Thank you for sharing. Do you think {newsSource} provides balanced coverage of important topics?",
    "How do you typically discover new stories on {newsSource}?"
  ])

  useEffect(() => {
    // Load content from localStorage if available
    const savedContent = localStorage.getItem("adminChatContent")
    if (savedContent) {
      const content = JSON.parse(savedContent)
      setTitle(content.title || title)
      setDescription(content.description || description)
      setInitialMessage(content.initialMessage || initialMessage)
      setMaxTurns(content.maxTurns || maxTurns)
      setFinalMessage(content.finalMessage || finalMessage)
      setPredefinedResponses(content.predefinedResponses || predefinedResponses)
    }

    // Get the news source and session ID from localStorage
    const source = localStorage.getItem("newsSource") || "your chosen source"
    const storedSessionId = localStorage.getItem("sessionId") || ""
    setNewsSource(source)
    setSessionId(storedSessionId)

    // Add initial message from the assistant
    const formattedInitialMessage = initialMessage.replace(/{newsSource}/g, source)
    const initialMsg: Message = {
      role: "assistant",
      content: formattedInitialMessage,
      timestamp: new Date().toISOString(),
    }
    setMessages([initialMsg])

    // Store initial message
    const chatLog = [initialMsg]
    localStorage.setItem("chatLog", JSON.stringify(chatLog))
  }, [])

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date().toISOString()
    }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    const currentInput = input
    setInput("")
    setIsLoading(true)

    // Store user message in chat log
    let chatLog = JSON.parse(localStorage.getItem("chatLog") || "[]")
    chatLog.push(userMessage)

    const newTurnCount = turnCount + 1
    setTurnCount(newTurnCount)

    // Generate response
    let response = ""
    if (newTurnCount >= maxTurns) {
      response = finalMessage
    } else {
      // Use predefined response for this turn
      const responseIndex = Math.min(newTurnCount - 1, predefinedResponses.length - 1)
      response = predefinedResponses[responseIndex]?.replace(/{newsSource}/g, newsSource) || 
                `Thank you for your response. Do you have any other thoughts about ${newsSource}?`
    }

     // Note: To switch to OpenAI/chatgpt responses, create app/api/ai/route.ts (see below),
      // add OPENAI_API_KEY to .env.local, install the SDK with: `npm i openai`,
      // then uncomment this following block. This will replace `response` above.
      // this works by just making a fetch request with the whole content to chatgpt.

    //   try {
    //     const aiRes = await fetch("/api/ai", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         // send recent context; trim to last 10 messages to keep tokens low
    //         messages: chatLog.slice(-10).map(m => ({ role: m.role, content: m.content }))
    //       }),
    //     })

    //     if (aiRes.ok) {
    //       const data = await aiRes.json()
    //       // fall back to predefined if empty
    //       response = data.reply || response
    //     } else {
    //       console.error("AI route error:", await aiRes.text())
    //     }
    //   } catch (err) {
    //     console.error("AI fetch failed:", err)
    //   }
    //   // ================================
    // 
    // }


    // Simulate loading delay
    setTimeout(() => {
      const assistantMessage: Message = { 
        role: "assistant", 
        content: response,
        timestamp: new Date().toISOString()
      }
      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)

      // Store assistant message in chat log
      chatLog.push(assistantMessage)
      localStorage.setItem("chatLog", JSON.stringify(chatLog))

      /*
      // COMMENTED OUT - Database integration for production
      try {
        // Save chat interaction to Heroku PostgreSQL database
        const chatData = {
          sessionId: sessionId,
          userMessage: currentInput,
          assistantResponse: response,
          turnNumber: newTurnCount,
          timestamp: new Date().toISOString(),
        }

        const dbResponse = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chatData),
        })

        if (!dbResponse.ok) {
          throw new Error("Failed to save chat data")
        }

        console.log("Chat data saved to database:", chatData)
      } catch (error) {
        console.error("Error saving chat data:", error)
      }
      */

      setIsLoading(false)

      // If we've reached the end of the conversation, enable the next button
      if (newTurnCount >= maxTurns) {
        // Update completed steps
        const storedSteps = localStorage.getItem("completedSteps")
        const steps = storedSteps ? JSON.parse(storedSteps) : [0, 1]
        if (!steps.includes(2)) {
          steps.push(2)
          localStorage.setItem("completedSteps", JSON.stringify(steps))
        }

        setTimeout(() => {
          router.push("/survey-2")
        }, 3000)
      }
    }, 1000)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-10 h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
            disabled={isLoading || turnCount >= maxTurns}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim() || turnCount >= maxTurns}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
