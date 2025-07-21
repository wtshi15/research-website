"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminHomePage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Content state
  const [title, setTitle] = useState("Research Project")
  const [subtitle, setSubtitle] = useState("Understanding News Consumption Patterns")
  const [aboutTitle, setAboutTitle] = useState("About This Study")
  const [aboutDescription, setAboutDescription] = useState("Learn about the purpose and goals of our research")
  const [aboutContent, setAboutContent] = useState([
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  ])
  const [processTitle, setProcessTitle] = useState("Participation Process")
  const [processDescription, setProcessDescription] = useState("What to expect during this study")
  const [processContent, setProcessContent] = useState(
    "The entire process should take approximately 10-15 minutes to complete. Your responses will be kept confidential and used only for research purposes.",
  )
  const [privacyText, setPrivacyText] = useState(
    "I agree to participate in this research study and consent to the collection and use of my responses for research purposes. I understand that my data will be kept confidential and used only for academic research."
  )

  useEffect(() => {
    // Check if logged in as admin
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    setIsAdmin(adminLoggedIn)

    if (!adminLoggedIn) {
      router.push("/login")
      return
    }

    // Load saved content if available
    const savedHomeContent = localStorage.getItem("adminHomeContent")
    if (savedHomeContent) {
      const content = JSON.parse(savedHomeContent)
      setTitle(content.title || title)
      setSubtitle(content.subtitle || subtitle)
      setAboutTitle(content.aboutTitle || aboutTitle)
      setAboutDescription(content.aboutDescription || aboutDescription)
      setAboutContent(content.aboutContent || aboutContent)
      setProcessTitle(content.processTitle || processTitle)
      setProcessDescription(content.processDescription || processDescription)
      setProcessContent(content.processContent || processContent)
      setPrivacyText(content.privacyText || privacyText)
    }

    setLoading(false)
  }, [router])

  const handleAboutContentChange = (index: number, value: string) => {
    const newContent = [...aboutContent]
    newContent[index] = value
    setAboutContent(newContent)
  }

  const addAboutParagraph = () => {
    setAboutContent([...aboutContent, "New paragraph content here..."])
  }

  const removeAboutParagraph = (index: number) => {
    const newContent = [...aboutContent]
    newContent.splice(index, 1)
    setAboutContent(newContent)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Save content to localStorage
    const content = {
      title,
      subtitle,
      aboutTitle,
      aboutDescription,
      aboutContent,
      processTitle,
      processDescription,
      processContent,
      privacyText,
    }

    localStorage.setItem("adminHomeContent", JSON.stringify(content))

    /*
    // COMMENTED OUT - Environment variables update for production
    try {
      // Save configuration to environment variables file
      const envData = {
        HOME_TITLE: title,
        HOME_SUBTITLE: subtitle,
        HOME_ABOUT_TITLE: aboutTitle,
        HOME_ABOUT_DESCRIPTION: aboutDescription,
        HOME_ABOUT_CONTENT: JSON.stringify(aboutContent),
        HOME_PROCESS_TITLE: processTitle,
        HOME_PROCESS_DESCRIPTION: processDescription,
        HOME_PROCESS_CONTENT: processContent,
        HOME_PRIVACY_TEXT: privacyText,
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

      console.log("Environment variables updated successfully")
    } catch (error) {
      console.error("Error updating environment variables:", error)
    }
    */

    alert("Home page content updated successfully!")
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
          <CardTitle>Edit Home Page</CardTitle>
          <CardDescription>Modify the content of the home page</CardDescription>
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
              <h3 className="text-lg font-medium mb-4">About This Study Section</h3>

              <div className="space-y-2 mb-4">
                <Label htmlFor="aboutTitle">Section Title</Label>
                <Input id="aboutTitle" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} />
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="aboutDescription">Section Description</Label>
                <Input
                  id="aboutDescription"
                  value={aboutDescription}
                  onChange={(e) => setAboutDescription(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Section Content</Label>
                {aboutContent.map((paragraph, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={paragraph}
                      onChange={(e) => handleAboutContentChange(index, e.target.value)}
                      rows={3}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeAboutParagraph(index)}
                      disabled={aboutContent.length <= 1}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addAboutParagraph}>
                  Add Paragraph
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Participation Process Section</h3>

              <div className="space-y-2 mb-4">
                <Label htmlFor="processTitle">Section Title</Label>
                <Input id="processTitle" value={processTitle} onChange={(e) => setProcessTitle(e.target.value)} />
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="processDescription">Section Description</Label>
                <Input
                  id="processDescription"
                  value={processDescription}
                  onChange={(e) => setProcessDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="processContent">Additional Content</Label>
                <Textarea
                  id="processContent"
                  value={processContent}
                  onChange={(e) => setProcessContent(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Privacy Policy & Consent</h3>

              <div className="space-y-2">
                <Label htmlFor="privacyText">Consent Text</Label>
                <Textarea
                  id="privacyText"
                  value={privacyText}
                  onChange={(e) => setPrivacyText(e.target.value)}
                  rows={4}
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
