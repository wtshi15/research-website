// lib/api.ts

// Use env variable if available, otherwise default to local backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export async function submitSurvey(answer: string, other?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/survey`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer, other }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error submitting survey:", error)
    throw error
  }
}

export async function sendChatMessage(sessionId: number, message: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: sessionId, message }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error sending chat message:", error)
    throw error
  }
}
