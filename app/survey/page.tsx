"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useProgress } from "@/components/progress-provider"
import { submitSurvey } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function SurveyPage() {
  const router = useRouter()
  const { markStepCompleted, setSessionId, setSurveyResponse } = useProgress()
  const [newsSource, setNewsSource] = useState<string>("")
  const [otherSource, setOtherSource] = useState<string>("")
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if there's a stored submission
    const stored = localStorage.getItem("submittedSurvey")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setNewsSource(parsed.newsSource)
        setOtherSource(parsed.otherSource || "")
        setShowOtherInput(parsed.newsSource === "Other")
        setIsSubmitted(true)
      } catch (err) {
        console.error("Failed to parse stored survey data:", err)
      }
    }
  }, [])

  const handleNewsSourceChange = (value: string) => {
    if (isSubmitted) return
    setNewsSource(value)
    setShowOtherInput(value === "Other")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const finalSource = newsSource === "Other" ? otherSource : newsSource

      // Submit to backend API
      const result = await submitSurvey(newsSource, newsSource === "Other" ? otherSource : undefined)

      // Store session ID for future API calls
      setSessionId(result.session_id)

      // Store the survey response for reference
      setSurveyResponse(finalSource)

      // Persist the submission
      localStorage.setItem(
        "submittedSurvey",
        JSON.stringify({
          newsSource,
          otherSource: newsSource === "Other" ? otherSource : null,
        })
      )

      // Mark this step as completed
      markStepCompleted("survey")

      // Navigate to the chat page
      router.push("/chat")
    } catch (error) {
      console.error("Error submitting survey:", error)
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
        <CardTitle>Initial Survey</CardTitle>
        <CardDescription>Please answer the following question about your news consumption habits.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="news-source" className="text-base">
              What is your favorite source of news?
            </Label>
            <RadioGroup
              id="news-source"
              value={newsSource}
              onValueChange={handleNewsSourceChange}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CNN" id="cnn" disabled={isSubmitted} />
                <Label htmlFor="cnn">CNN</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FOX" id="fox" disabled={isSubmitted} />
                <Label htmlFor="fox">FOX</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Twitter" id="twitter" disabled={isSubmitted} />
                <Label htmlFor="twitter">Twitter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="TikTok" id="tiktok" disabled={isSubmitted} />
                <Label htmlFor="tiktok">TikTok</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Other" id="other" disabled={isSubmitted} />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>

            {showOtherInput && (
              <div className="pt-2">
                <Label htmlFor="other-source">Please specify:</Label>
                <Input
                  id="other-source"
                  value={otherSource}
                  onChange={(e) => setOtherSource(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your news source"
                  disabled={isSubmitted}
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="submit"
            disabled={
              isSubmitted ||
              isSubmitting ||
              !newsSource ||
              (newsSource === "Other" && !otherSource)
            }
          >
            {isSubmitting ? "Submitting..." : "Next"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
