"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

type SurveyOption = {
  id: string
  label: string
  value: string
}

export default function FollowUpSurveyPage() {
  const router = useRouter()
  const [satisfaction, setSatisfaction] = useState<string>("")
  const [feedback, setFeedback] = useState<string>("")

  // Content state
  const [title, setTitle] = useState("Follow-up Survey")
  const [description, setDescription] = useState(
    "Please share your thoughts about your experience with our AI assistant.",
  )
  const [satisfactionLabel, setSatisfactionLabel] = useState("How satisfied were you with the conversation?")
  const [satisfactionOptions, setSatisfactionOptions] = useState<SurveyOption[]>([
    { id: "very-satisfied", label: "Very Satisfied", value: "very-satisfied" },
    { id: "satisfied", label: "Satisfied", value: "satisfied" },
    { id: "neutral", label: "Neutral", value: "neutral" },
    { id: "dissatisfied", label: "Dissatisfied", value: "dissatisfied" },
    { id: "very-dissatisfied", label: "Very Dissatisfied", value: "very-dissatisfied" },
  ])
  const [feedbackLabel, setFeedbackLabel] = useState("Do you have any additional feedback about your experience?")
  const [feedbackPlaceholder, setFeedbackPlaceholder] = useState("Share your thoughts here...")

  useEffect(() => {
    // Load content from localStorage if available
    const savedContent = localStorage.getItem("adminSurvey2Content")
    if (savedContent) {
      const content = JSON.parse(savedContent)
      setTitle(content.title || title)
      setDescription(content.description || description)
      setSatisfactionLabel(content.satisfactionLabel || satisfactionLabel)
      setSatisfactionOptions(content.satisfactionOptions || satisfactionOptions)
      setFeedbackLabel(content.feedbackLabel || feedbackLabel)
      setFeedbackPlaceholder(content.feedbackPlaceholder || feedbackPlaceholder)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const sessionId = localStorage.getItem("sessionId")
    const followUpData = {
      sessionId: sessionId,
      satisfaction: satisfaction,
      feedback: feedback,
      timestamp: new Date().toISOString(),
    }

    // Store follow-up survey data locally
    localStorage.setItem("followUpSurveyData", JSON.stringify(followUpData))

    /*
    // COMMENTED OUT - Database integration for production
    try {
      // Save to Heroku PostgreSQL database
      const response = await fetch("/api/survey-2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(followUpData),
      })

      if (!response.ok) {
        throw new Error("Failed to save follow-up survey data")
      }

      console.log("Follow-up survey data saved to database:", followUpData)
    } catch (error) {
      console.error("Error saving follow-up survey data:", error)
      alert("There was an error saving your response. Please try again.")
      return
    }
    */

    // Update completed steps
    const storedSteps = localStorage.getItem("completedSteps")
    const steps = storedSteps ? JSON.parse(storedSteps) : [0, 1, 2]
    if (!steps.includes(3)) {
      steps.push(3)
      localStorage.setItem("completedSteps", JSON.stringify(steps))
    }

    // Navigate to the thank you page
    router.push("/thank-you")
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
            <Label htmlFor="satisfaction" className="text-base">
              {satisfactionLabel}
            </Label>
            <RadioGroup id="satisfaction" value={satisfaction} onValueChange={setSatisfaction} className="space-y-3">
              {satisfactionOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.id} />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-base">
              {feedbackLabel}
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={feedbackPlaceholder}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" disabled={!satisfaction}>
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
