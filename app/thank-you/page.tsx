"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useEffect } from "react"
import { useProgress } from "@/components/progress-provider"

export default function ThankYouPage() {
  const { markStepCompleted } = useProgress()

  // Mark this step as completed
  useEffect(() => {
    markStepCompleted("thank-you")
  }, [markStepCompleted])

  return (
    <div className="space-y-8 pt-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Thank You!</h1>
        <p className="text-xl text-muted-foreground">We appreciate your participation in our research study.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Contribution Matters</CardTitle>
          <CardDescription>How your participation helps our research</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc
            nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl
            aliquet nunc, quis aliquam nisl nunc quis nisl.
          </p>
          <p>
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
            in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>What happens with the data collected</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc
            nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl
            aliquet nunc, quis aliquam nisl nunc quis nisl.
          </p>
          <p>
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
            in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          {/* <div className="pt-4">
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </div> */}
        </CardContent>
      </Card>
    </div>
  )
}
