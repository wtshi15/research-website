import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-8 pt-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Research Project</h1>
        <p className="text-xl text-muted-foreground">Understanding News Consumption Patterns</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Study</CardTitle>
          <CardDescription>Learn about the purpose and goals of our research</CardDescription>
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
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
            totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
            explicabo.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participation Process</CardTitle>
          <CardDescription>What to expect during this study</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>This study consists of the following steps:</p>
          <ol className="list-decimal list-inside space-y-2 pl-4">
            <li>Complete a brief survey about your news consumption habits</li>
            <li>Engage in a short conversation with our AI assistant</li>
            <li>Complete a follow-up survey about your experience</li>
          </ol>
          <p>
            The entire process should take approximately 10-15 minutes to complete. Your responses will be kept
            confidential and used only for research purposes.
          </p>
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
