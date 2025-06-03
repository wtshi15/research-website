"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {
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

  useEffect(() => {
    // Load content from localStorage if available
    const savedContent = localStorage.getItem("adminHomeContent")
    if (savedContent) {
      const content = JSON.parse(savedContent)
      setTitle(content.title || title)
      setSubtitle(content.subtitle || subtitle)
      setAboutTitle(content.aboutTitle || aboutTitle)
      setAboutDescription(content.aboutDescription || aboutDescription)
      setAboutContent(content.aboutContent || aboutContent)
      setProcessTitle(content.processTitle || processTitle)
      setProcessDescription(content.processDescription || processDescription)
      setProcessContent(content.processContent || processContent)
    }
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 mt-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="text-xl text-muted-foreground">{subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{aboutTitle}</CardTitle>
          <CardDescription>{aboutDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {aboutContent.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{processTitle}</CardTitle>
          <CardDescription>{processDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>This study consists of the following steps:</p>
          <ol className="list-decimal list-inside space-y-2 pl-4">
            <li>Complete a brief survey about your news consumption habits</li>
            <li>Engage in a short conversation with our AI assistant</li>
            <li>Complete a follow-up survey about your experience</li>
          </ol>
          <p>{processContent}</p>
          <div className="pt-4">
            <Link href="/survey">
              <Button size="lg">Begin Participation</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
