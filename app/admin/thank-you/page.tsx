"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminThankYouPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Content state
  const [title, setTitle] = useState("Thank You!")
  const [subtitle, setSubtitle] = useState("We appreciate your participation in our research study.")

  const [section1Title, setSection1Title] = useState("Your Contribution Matters")
  const [section1Description, setSection1Description] = useState("How your participation helps our research")
  const [section1Content, setSection1Content] = useState([
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  ])

  const [section2Title, setSection2Title] = useState("Next Steps")
  const [section2Description, setSection2Description] = useState("What happens with the data collected")
  const [section2Content, setSection2Content] = useState([
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
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
    const savedContent = localStorage.getItem("adminThankYouContent")
    if (savedContent) {
      const content = JSON.parse(savedContent)
      setTitle(content.title || title)
      setSubtitle(content.subtitle || subtitle)
      setSection1Title(content.section1Title || section1Title)
      setSection1Description(content.section1Description || section1Description)
      setSection1Content(content.section1Content || section1Content)
      setSection2Title(content.section2Title || section2Title)
      setSection2Description(content.section2Description || section2Description)
      setSection2Content(content.section2Content || section2Content)
    }

    setLoading(false)
  }, [router])

  const handleSection1ContentChange = (index: number, value: string) => {
    const newContent = [...section1Content]
    newContent[index] = value
    setSection1Content(newContent)
  }

  const addSection1Paragraph = () => {
    setSection1Content([...section1Content, "New paragraph content here..."])
  }

  const removeSection1Paragraph = (index: number) => {
    const newContent = [...section1Content]
    newContent.splice(index, 1)
    setSection1Content(newContent)
  }

  const handleSection2ContentChange = (index: number, value: string) => {
    const newContent = [...section2Content]
    newContent[index] = value
    setSection2Content(newContent)
  }

  const addSection2Paragraph = () => {
    setSection2Content([...section2Content, "New paragraph content here..."])
  }

  const removeSection2Paragraph = (index: number) => {
    const newContent = [...section2Content]
    newContent.splice(index, 1)
    setSection2Content(newContent)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Save content to localStorage
    const content = {
      title,
      subtitle,
      section1Title,
      section1Description,
      section1Content,
      section2Title,
      section2Description,
      section2Content,
    }

    localStorage.setItem("adminThankYouContent", JSON.stringify(content))
    alert("Thank You page content updated successfully!")
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
          <CardTitle>Edit Thank You Page</CardTitle>
          <CardDescription>Modify the content of the thank you page</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Page Subtitle</Label>
              <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Section 1</h3>

              <div className="space-y-2 mb-4">
                <Label htmlFor="section1Title">Section Title</Label>
                <Input id="section1Title" value={section1Title} onChange={(e) => setSection1Title(e.target.value)} />
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="section1Description">Section Description</Label>
                <Input
                  id="section1Description"
                  value={section1Description}
                  onChange={(e) => setSection1Description(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Section Content</Label>
                {section1Content.map((paragraph, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={paragraph}
                      onChange={(e) => handleSection1ContentChange(index, e.target.value)}
                      rows={3}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSection1Paragraph(index)}
                      disabled={section1Content.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSection1Paragraph}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Paragraph
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Section 2</h3>

              <div className="space-y-2 mb-4">
                <Label htmlFor="section2Title">Section Title</Label>
                <Input id="section2Title" value={section2Title} onChange={(e) => setSection2Title(e.target.value)} />
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="section2Description">Section Description</Label>
                <Input
                  id="section2Description"
                  value={section2Description}
                  onChange={(e) => setSection2Description(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Section Content</Label>
                {section2Content.map((paragraph, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={paragraph}
                      onChange={(e) => handleSection2ContentChange(index, e.target.value)}
                      rows={3}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSection2Paragraph(index)}
                      disabled={section2Content.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSection2Paragraph}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Paragraph
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
