"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type ProgressContextType = {
  completedSteps: string[]
  markStepCompleted: (step: string) => void
  isStepCompleted: (step: string) => boolean
  sessionId: number | null
  setSessionId: (id: number) => void
  surveyResponse: string | null
  setSurveyResponse: (response: string) => void
  chatHistory: { role: string; content: string }[]
  addChatMessage: (role: string, content: string) => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [surveyResponse, setSurveyResponse] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([])

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedSteps = localStorage.getItem("completedSteps")
    const savedSessionId = localStorage.getItem("sessionId")
    const savedSurveyResponse = localStorage.getItem("surveyResponse")
    const savedChatHistory = localStorage.getItem("chatHistory")

    if (savedSteps) setCompletedSteps(JSON.parse(savedSteps))
    if (savedSessionId) setSessionId(Number.parseInt(savedSessionId))
    if (savedSurveyResponse) setSurveyResponse(savedSurveyResponse)
    if (savedChatHistory) setChatHistory(JSON.parse(savedChatHistory))
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("completedSteps", JSON.stringify(completedSteps))
  }, [completedSteps])

  useEffect(() => {
    if (sessionId) localStorage.setItem("sessionId", sessionId.toString())
  }, [sessionId])

  useEffect(() => {
    if (surveyResponse) localStorage.setItem("surveyResponse", surveyResponse)
  }, [surveyResponse])

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory))
  }, [chatHistory])

  const markStepCompleted = (step: string) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step])
    }
  }

  const isStepCompleted = (step: string) => {
    return completedSteps.includes(step)
  }

  const addChatMessage = (role: string, content: string) => {
    setChatHistory((prev) => [...prev, { role, content }])
  }

  return (
    <ProgressContext.Provider
      value={{
        completedSteps,
        markStepCompleted,
        isStepCompleted,
        sessionId,
        setSessionId,
        surveyResponse,
        setSurveyResponse,
        chatHistory,
        addChatMessage,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider")
  }
  return context
}
