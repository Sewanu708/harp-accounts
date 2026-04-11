import { type NextRequest, NextResponse } from "next/server"

const EXTERNAL_API_BASE = process.env.EXTERNAL_API_URL || "https://api.example.com"

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  if (!action) {
    return NextResponse.json({ error: "Action parameter is required" }, { status: 400 })
  }

  try {
    const body = await request.json()

    // Map frontend actions to backend endpoints
    const endpointMap: Record<string, string> = {
      signup: "/auth/register",
      login: "/auth/login",
      "verify-otp": "/auth/verify-otp",
      "resend-token": "/auth/resend-verification",
      "reset-password": "/auth/forgot-password",
      "set-password": "/auth/reset-password",
      "update-profile": "/auth/profile",
      kyc: "/auth/kyc",
    }

    const endpoint = endpointMap[action]
    if (!endpoint) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    // Forward request to external API
    const response = await fetch(`${EXTERNAL_API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    // Forward the response
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Proxy Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  if (action === "profile") {
    try {
      const response = await fetch(`${EXTERNAL_API_BASE}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: request.headers.get("Authorization") || "",
        },
      })

      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    } catch (error) {
      console.error("Proxy Error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
