"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if already logged in
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    setIsAdmin(adminLoggedIn)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple authentication
    if (username === "admin" && password === "password") {
      localStorage.setItem("adminLoggedIn", "true")
      router.push("/admin/home")
    } else {
      setError("Invalid username or password")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    setIsAdmin(false)
  }

  if (isAdmin) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>You are currently logged in as an administrator</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            From here you can access the admin editing panels for each page of the research project.
          </p>
          <p>Use the sidebar navigation to access the editing panels.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Administrator Login</CardTitle>
        <CardDescription>Login to access the admin panel</CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Login</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
