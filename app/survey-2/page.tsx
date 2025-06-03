"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useProgress } from "@/components/progress-provider"
import { useToast } from "@/hooks/use-toast"

type SurveyOption = {
  id: string
  label: string
  value: string
}

export default function FollowUpSurveyPage() {
  const router = useRouter()
  const { markStepCompleted, isStepCompleted } = useProgress()
  const { toast } = useToast()

  const [satisfaction, setSatisfaction] = useState<string>("")
  const [feedback, setFeedback] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Content state
  const [title, setTitle] = useState("Follow-up Survey")
  const [description, setDescription] = useState(
    "Please share your thoughts about your experience with our AI assistant."
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
    if (!isStepCompleted("chat")) {
      toast({
        title: "Error",
        description: "Please complete the chat interaction first",
        variant: "destructive",
      })
      router.push("/chat")
      return
    }

    const stored = localStorage.getItem("submittedFollowUpSurvey")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSatisfaction(parsed.satisfaction)
        setFeedback(parsed.feedback || "")
        setIsSubmitted(true)
      } catch (err) {
        console.error("Failed to parse follow-up survey data:", err)
      }
    }

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
  }, [isStepCompleted, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("Follow-up survey response:", { satisfaction, feedback })

      localStorage.setItem(
        "submittedFollowUpSurvey",
        JSON.stringify({ satisfaction, feedback })
      )

      markStepCompleted("survey-2")
      router.push("/thank-you")
    } catch (error) {
      console.error("Error submitting follow-up survey:", error)
      toast({
        title: "Error",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
            <RadioGroup
              id="satisfaction"
              value={satisfaction}
              onValueChange={(val) => !isSubmitted && setSatisfaction(val)}
              className="space-y-3"
            >
              {satisfactionOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.id} disabled={isSubmitted} />
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
              disabled={isSubmitted}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" disabled={isSubmitting || !satisfaction || isSubmitted}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}