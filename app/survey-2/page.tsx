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

export default function FollowUpSurveyPage() {
  const router = useRouter()
  const { markStepCompleted, isStepCompleted } = useProgress()
  const { toast } = useToast()
  const [satisfaction, setSatisfaction] = useState<string>("")
  const [feedback, setFeedback] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // On load: validate step completion + restore previous submission if exists
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
  }, [isStepCompleted, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("Follow-up survey response:", { satisfaction, feedback })

      // Persist locally
      localStorage.setItem(
        "submittedFollowUpSurvey",
        JSON.stringify({ satisfaction, feedback })
      )

      // Mark this step as completed
      markStepCompleted("survey-2")

      // Navigate to the thank-you page
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
    <Card className="mt-10">
      <CardHeader>
        <CardTitle>Follow-up Survey</CardTitle>
        <CardDescription>Please share your thoughts about your experience with our AI assistant.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="satisfaction" className="text-base">
              How satisfied were you with the conversation?
            </Label>
            <RadioGroup
              id="satisfaction"
              value={satisfaction}
              onValueChange={(val) => !isSubmitted && setSatisfaction(val)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-satisfied" id="very-satisfied" disabled={isSubmitted} />
                <Label htmlFor="very-satisfied">Very Satisfied</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="satisfied" id="satisfied" disabled={isSubmitted} />
                <Label htmlFor="satisfied">Satisfied</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id="neutral" disabled={isSubmitted} />
                <Label htmlFor="neutral">Neutral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dissatisfied" id="dissatisfied" disabled={isSubmitted} />
                <Label htmlFor="dissatisfied">Dissatisfied</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-dissatisfied" id="very-dissatisfied" disabled={isSubmitted} />
                <Label htmlFor="very-dissatisfied">Very Dissatisfied</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-base">
              Do you have any additional feedback about your experience?
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts here..."
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
