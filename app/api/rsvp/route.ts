import { NextResponse } from "next/server"

// Proxy RSVP submissions to Google Apps Script to bypass browser CORS.
// Configure endpoint via env GOOGLE_SCRIPT_ENDPOINT for flexibility.
const GOOGLE_SCRIPT_ENDPOINT = process.env.GOOGLE_SCRIPT_ENDPOINT

export async function POST(request: Request) {
  if (!GOOGLE_SCRIPT_ENDPOINT) {
    return NextResponse.json({ error: "Missing GOOGLE_SCRIPT_ENDPOINT" }, { status: 500 })
  }

  try {
    const body = await request.json()
    const res = await fetch(GOOGLE_SCRIPT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: "Upstream error", details: text }, { status: res.status })
    }

    const data = await res.json().catch(() => ({}))
    return NextResponse.json({ ok: true, data })
  } catch (error) {
    console.error("RSVP proxy error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

