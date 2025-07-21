"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type SurveyOption = {
  id: string
  label: string
  value: string
}

export default function SurveyPage() {
  const router = useRouter()
  const [newsSource, setNewsSource] = useState<string>("")
  const [otherSource, setOtherSource] = useState<string>("")
  const [showOtherInput, setShowOtherInput] = useState(false)

  // Content state
  const [title, setTitle] = useState("Initial Survey")
  const [description, setDescription] = useState(
    "Please answer the following question about your news consumption habits.",
  )
  const [questionLabel, setQuestionLabel] = useState("What is your favorite source of news?")
  const [options, setOptions] = useState<SurveyOption[]>([
    { id: "cnn", label: "CNN", value: "CNN" },
    { id: "fox", label: "FOX", value: "FOX" },
    { id: "twitter", label: "Twitter", value: "Twitter" },
    { id: "tiktok", label: "TikTok", value: "TikTok" },
    { id: "other", label: "Other", value: "Other" },
  ])
  const [otherLabel, setOtherLabel] = useState("Please specify:")
  const [otherPlaceholder, setOtherPlaceholder] = useState("Enter your news source")

  useEffect(() => {
    // Load content from localStorage if available
    const savedContent = localStorage.getItem("adminSurveyContent")
    if (savedContent) {
      const content = JSON.parse(savedContent)
      setTitle(content.title || title)
      setDescription(content.description || description)
      setQuestionLabel(content.questionLabel || questionLabel)
      setOptions(content.options || options)
      setOtherLabel(content.otherLabel || otherLabel)
      setOtherPlaceholder(content.otherPlaceholder || otherPlaceholder)
    }
  }, [])

  const handleNewsSourceChange = (value: string) => {
    setNewsSource(value)
    setShowOtherInput(value === "Other")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const finalSource = newsSource === "Other" ? otherSource : newsSource
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Store data locally for dev environment
    localStorage.setItem("sessionId", sessionId)
    localStorage.setItem("newsSource", finalSource)

    // Store survey data locally
    const surveyData = {
      sessionId,
      newsSource: finalSource,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("surveyData", JSON.stringify(surveyData))

    /* 
    // COMMENTED OUT - Database integration for production
    try {
      // Save to Heroku PostgreSQL database
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData),
      })

      if (!response.ok) {
        throw new Error("Failed to save survey data")
      }

      const data = await response.json()
      console.log("Survey data saved to database:", data)
    } catch (error) {
      console.error("Error saving survey data:", error)
      alert("There was an error saving your response. Please try again.")
      return
    }
    */

    // Update completed steps
    const storedSteps = localStorage.getItem("completedSteps")
    const steps = storedSteps ? JSON.parse(storedSteps) : [0]
    if (!steps.includes(1)) {
      steps.push(1)
      localStorage.setItem("completedSteps", JSON.stringify(steps))
    }

    // Navigate to the chat page
    router.push("/chat")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="news-source" className="text-base">
              {questionLabel}
            </Label>
            <RadioGroup
              id="news-source"
              value={newsSource}
              onValueChange={handleNewsSourceChange}
              className="space-y-3"
            >
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.id} />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>

            {showOtherInput && (
              <div className="pt-2">
                <Label htmlFor="other-source">{otherLabel}</Label>
                <Input
                  id="other-source"
                  value={otherSource}
                  onChange={(e) => setOtherSource(e.target.value)}
                  className="mt-1"
                  placeholder={otherPlaceholder}
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" disabled={!newsSource || (newsSource === "Other" && !otherSource)}>
            Next
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
