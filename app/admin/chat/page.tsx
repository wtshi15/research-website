"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ChatMessage = {
  id: string
  content: string
  turnNumber: number
}

export default function AdminChatPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "msg-1", content: "That's interesting! How often do you consume news from {newsSource}?", turnNumber: 1 },
    {
      id: "msg-2",
      content: "Thank you for sharing. Do you think {newsSource} provides balanced coverage of important topics?",
      turnNumber: 2,
    },
  ])

  useEffect(() => {
    // Check if logged in as admin
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    setIsAdmin(adminLoggedIn)

    if (!adminLoggedIn) {
      router.push("/login")
      return
    }

    // Load saved content if available
    const savedContent = localStorage.getItem("adminChatContent")
    if (savedContent) {
      const content = JSON.parse(savedContent)
      setTitle(content.title || title)
      setDescription(content.description || description)
      setInitialMessage(content.initialMessage || initialMessage)
      setMaxTurns(content.maxTurns || maxTurns)
      setFinalMessage(content.finalMessage || finalMessage)
      setMessages(content.messages || messages)
    }

    setLoading(false)
  }, [router])

  const handleMessageChange = (index: number, value: string) => {
    const newMessages = [...messages]
    newMessages[index] = { ...newMessages[index], content: value }
    setMessages(newMessages)
  }

  const addMessage = () => {
    const newId = `msg-${Date.now()}`
    const newTurnNumber = messages.length > 0 ? Math.max(...messages.map((m) => m.turnNumber)) + 1 : 1
    setMessages([...messages, { id: newId, content: "New message content here...", turnNumber: newTurnNumber }])
  }

  const removeMessage = (index: number) => {
    const newMessages = [...messages]
    newMessages.splice(index, 1)
    setMessages(newMessages)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Save content to localStorage
    const content = {
      title,
      description,
      initialMessage,
      maxTurns,
      finalMessage,
      messages,
    }

    localStorage.setItem("adminChatContent", JSON.stringify(content))
    alert("Chat page content updated successfully!")
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!isAdmin) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-10">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>You must be logged in as an administrator to access this page.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 mt-10 pb-20">
      <Card>
        <CardHeader>
          <CardTitle>Edit Chat Page</CardTitle>
          <CardDescription>Modify the content and behavior of the chat page</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Page Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Chat Settings</h3>

              <div className="space-y-2 mb-4">
                <Label htmlFor="initialMessage">Initial Message</Label>
                <Textarea
                  id="initialMessage"
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  rows={2}
                />
                <p className="text-sm text-muted-foreground">
                  Use {"{newsSource}"} to reference the user's selected news source.
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="maxTurns">Maximum Conversation Turns</Label>
                <Select value={maxTurns.toString()} onValueChange={(value) => setMaxTurns(Number.parseInt(value))}>
                  <SelectTrigger id="maxTurns">
                    <SelectValue placeholder="Select number of turns" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="finalMessage">Final Message</Label>
                <Textarea
                  id="finalMessage"
                  value={finalMessage}
                  onChange={(e) => setFinalMessage(e.target.value)}
                  rows={2}
                />
                <p className="text-sm text-muted-foreground">
                  This message is shown after the maximum number of turns.
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">AI Response Messages</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure the messages the AI will use during the conversation. The messages will be used in order based
                on the turn number.
              </p>

              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={message.id} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor={`message-${index}`}>Turn {message.turnNumber}</Label>
                      </div>
                      <Textarea
                        id={`message-${index}`}
                        value={message.content}
                        onChange={(e) => handleMessageChange(index, e.target.value)}
                        rows={2}
                      />
                    </div>
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeMessage(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addMessage} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Message
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
