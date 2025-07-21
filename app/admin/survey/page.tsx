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

export default function AdminSurveyPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

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
    // Check if logged in as admin
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    setIsAdmin(adminLoggedIn)

    if (!adminLoggedIn) {
      router.push("/login")
      return
    }

    // Load saved content if available
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

    setLoading(false)
  }, [router])

  const handleOptionChange = (index: number, field: keyof SurveyOption, value: string) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setOptions(newOptions)
  }

  const addOption = () => {
    const newId = `option-${Date.now()}`
    setOptions([...options, { id: newId, label: "New Option", value: newId }])
  }

  const removeOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Save content to localStorage
    const content = {
      title,
      description,
      questionLabel,
      options,
      otherLabel,
      otherPlaceholder,
    }

    localStorage.setItem("adminSurveyContent", JSON.stringify(content))
    alert("Survey page content updated successfully!")
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
          <CardTitle>Edit Initial Survey</CardTitle>
          <CardDescription>Modify the content of the initial survey page</CardDescription>
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

            <div className="space-y-2">
              <Label htmlFor="questionLabel">Question Label</Label>
              <Input id="questionLabel" value={questionLabel} onChange={(e) => setQuestionLabel(e.target.value)} />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Survey Options</h3>

              <div className="space-y-4">
                {options.map((option, index) => (
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
                      disabled={options.length <= 1}
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
              <h3 className="text-lg font-medium mb-4">"Other" Option Settings</h3>

              <div className="space-y-2">
                <Label htmlFor="otherLabel">Other Label</Label>
                <Input id="otherLabel" value={otherLabel} onChange={(e) => setOtherLabel(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherPlaceholder">Other Placeholder</Label>
                <Input
                  id="otherPlaceholder"
                  value={otherPlaceholder}
                  onChange={(e) => setOtherPlaceholder(e.target.value)}
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
