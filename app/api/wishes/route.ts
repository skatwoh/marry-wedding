import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const wishesFilePath = path.join(process.cwd(), "data", "wishes.json")

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function readWishes() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(wishesFilePath, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeWishes(wishes: any[]) {
  await ensureDataDirectory()
  await fs.writeFile(wishesFilePath, JSON.stringify(wishes, null, 2))
}

export async function GET() {
  const wishes = await readWishes()
  return NextResponse.json(wishes)
}

export async function POST(request: Request) {
  try {
    const { name, message } = await request.json()

    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 })
    }

    const wishes = await readWishes()
    const newWish = {
      name,
      message,
      timestamp: Date.now(),
    }

    wishes.push(newWish)
    await writeWishes(wishes)

    return NextResponse.json(newWish, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save wish" }, { status: 500 })
  }
}
