"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type SurveyOption = {
  id: string
  label: string
  value: string
}

export default function AdminSurvey2Page() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

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
    // Check if logged in as admin
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    setIsAdmin(adminLoggedIn)

    if (!adminLoggedIn) {
      router.push("/login")
      return
    }

    // Load saved content if available
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

    setLoading(false)
  }, [router])

  const handleOptionChange = (index: number, field: keyof SurveyOption, value: string) => {
    const newOptions = [...satisfactionOptions]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setSatisfactionOptions(newOptions)
  }

  const addOption = () => {
    const newId = `option-${Date.now()}`
    setSatisfactionOptions([...satisfactionOptions, { id: newId, label: "New Option", value: newId }])
  }

  const removeOption = (index: number) => {
    const newOptions = [...satisfactionOptions]
    newOptions.splice(index, 1)
    setSatisfactionOptions(newOptions)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Save content to localStorage
    const content = {
      title,
      description,
      satisfactionLabel,
      satisfactionOptions,
      feedbackLabel,
      feedbackPlaceholder,
    }

    localStorage.setItem("adminSurvey2Content", JSON.stringify(content))
    alert("Follow-up survey page content updated successfully!")
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
          <CardTitle>Edit Follow-up Survey</CardTitle>
          <CardDescription>Modify the content of the follow-up survey page</CardDescription>
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
              <h3 className="text-lg font-medium mb-4">Satisfaction Question</h3>

              <div className="space-y-2 mb-4">
                <Label htmlFor="satisfactionLabel">Question Label</Label>
                <Input
                  id="satisfactionLabel"
                  value={satisfactionLabel}
                  onChange={(e) => setSatisfactionLabel(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Satisfaction Options</Label>
                {satisfactionOptions.map((option, index) => (
                  <div key={option.id} className="flex gap-2 items-center">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor={`option-label-${index}`} className="sr-only">
                          Option Label
                        </Label>
                        <Input
                          id={`option-label-${index}`}
                          value={option.label}
                          onChange={(e) => handleOptionChange(index, "label", e.target.value)}
                          placeholder="Option Label"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`option-value-${index}`} className="sr-only">
                          Option Value
                        </Label>
                        <Input
                          id={`option-value-${index}`}
                          value={option.value}
                          onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                          placeholder="Option Value"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={satisfactionOptions.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addOption} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Option
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Feedback Question</h3>

              <div className="space-y-2">
                <Label htmlFor="feedbackLabel">Question Label</Label>
                <Input id="feedbackLabel" value={feedbackLabel} onChange={(e) => setFeedbackLabel(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedbackPlaceholder">Textarea Placeholder</Label>
                <Input
                  id="feedbackPlaceholder"
                  value={feedbackPlaceholder}
                  onChange={(e) => setFeedbackPlaceholder(e.target.value)}
                />
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
