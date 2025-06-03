"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useProgress } from "@/components/progress-provider"
import { submitSurvey } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

type SurveyOption = {
  id: string
  label: string
  value: string
}

export default function SurveyPage() {
  const router = useRouter()
  const { markStepCompleted, setSessionId, setSurveyResponse } = useProgress()
  const { toast } = useToast()

  const [newsSource, setNewsSource] = useState<string>("")
  const [otherSource, setOtherSource] = useState<string>("")
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Content state
  const [title, setTitle] = useState("Initial Survey")
  const [description, setDescription] = useState(
    "Please answer the following question about your news consumption habits."
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
    setIsSubmitting(true)

    try {
      const finalSource = newsSource === "Other" ? otherSource : newsSource

      const result = await submitSurvey(newsSource, newsSource === "Other" ? otherSource : undefined)

      setSessionId(result.session_id)
      setSurveyResponse(finalSource)

      localStorage.setItem("submittedSurvey", JSON.stringify({
        newsSource,
        otherSource: newsSource === "Other" ? otherSource : null,
      }))

      markStepCompleted("survey")
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
          <Button
            type="submit"
            disabled={isSubmitting || !newsSource || (newsSource === "Other" && !otherSource)}
          >
            {isSubmitting ? "Submitting..." : "Next"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
