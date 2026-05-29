import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const CONTENT_PATH = path.join(process.cwd(), 'data', 'site-content.json')

export async function GET() {
  try {
    const data = await fs.readFile(CONTENT_PATH, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newContent = await request.json()
    await fs.writeFile(CONTENT_PATH, JSON.stringify(newContent, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}
