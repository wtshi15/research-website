"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ThankYouPage() {
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
    // Update completed steps
    const storedSteps = localStorage.getItem("completedSteps")
    const steps = storedSteps ? JSON.parse(storedSteps) : [0, 1, 2, 3]
    if (!steps.includes(4)) {
      steps.push(4)
      localStorage.setItem("completedSteps", JSON.stringify(steps))
    }

    // Load content from localStorage if available
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
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 mt-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="text-xl text-muted-foreground">{subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{section1Title}</CardTitle>
          <CardDescription>{section1Description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {section1Content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{section2Title}</CardTitle>
          <CardDescription>{section2Description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {section2Content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <div className="pt-4">
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
