"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Plus, Trash2 } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const [predefinedResponses, setPredefinedResponses] = useState([
    "That's interesting! How often do you consume news from {newsSource}?",
    "Thank you for sharing. Do you think {newsSource} provides balanced coverage of important topics?",
    "How do you typically discover new stories on {newsSource}?"
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
      setPredefinedResponses(content.predefinedResponses || predefinedResponses)
    }

    setLoading(false)
  }, [router])

  const handleResponseChange = (index: number, value: string) => {
    const newResponses = [...predefinedResponses]
    newResponses[index] = value
    setPredefinedResponses(newResponses)
  }

  const addResponse = () => {
    setPredefinedResponses([...predefinedResponses, "New response about {newsSource}..."])
  }

  const removeResponse = (index: number) => {
    const newResponses = [...predefinedResponses]
    newResponses.splice(index, 1)
    setPredefinedResponses(newResponses)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Save content to localStorage
    const content = {
      title,
      description,
      initialMessage,
      maxTurns,
      finalMessage,
      predefinedResponses,
    }

    localStorage.setItem("adminChatContent", JSON.stringify(content))

    /*
    // COMMENTED OUT - Environment variables update for production
    try {
      // Save configuration to environment variables file
      const envData = {
        CHAT_TITLE: title,
        CHAT_DESCRIPTION: description,
        CHAT_INITIAL_MESSAGE: initialMessage,
        CHAT_MAX_TURNS: maxTurns.toString(),
        CHAT_FINAL_MESSAGE: finalMessage,
        CHAT_PREDEFINED_RESPONSES: JSON.stringify(predefinedResponses),
      }

      const response = await fetch("/api/admin/update-env", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(envData),
      })

      if (!response.ok) {
        throw new Error("Failed to update environment variables")
      }

      console.log("Chat environment variables updated successfully")
    } catch (error) {
      console.error("Error updating environment variables:", error)
    }
    */

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
              <h3 className="text-lg font-medium mb-4">Predefined AI Responses</h3>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  These are the automatic responses the AI will give during the conversation. Use {"{newsSource}"} to reference the user's selected news source.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {predefinedResponses.map((response, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor={`response-${index}`}>Response {index + 1}</Label>
                      </div>
                      <Textarea
                        id={`response-${index}`}
                        value={response}
                        onChange={(e) => handleResponseChange(index, e.target.value)}
                        rows={2}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeResponse(index)}
                      disabled={predefinedResponses.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addResponse}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Response
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
