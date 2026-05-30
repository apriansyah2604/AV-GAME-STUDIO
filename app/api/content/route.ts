import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Konfigurasi Path Database
const CONTENT_PATH = path.join(process.cwd(), 'data', 'site-content.json')
const GALLERY_PATH = path.join(process.cwd(), 'data', 'gallery.json')

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  try {
    if (type === 'gallery') {
      const data = await fs.readFile(GALLERY_PATH, 'utf-8')
      return NextResponse.json(JSON.parse(data))
    }
    const data = await fs.readFile(CONTENT_PATH, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json({ robux_packages: [], avatar_services: [], general: {} })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data: newData } = body

    // Logika simpan data berdasarkan type
    if (type === 'gallery') {
      await fs.writeFile(GALLERY_PATH, JSON.stringify(newData, null, 2))
      return NextResponse.json({ success: true })
    }

    const fileContent = await fs.readFile(CONTENT_PATH, 'utf-8')
    const content = JSON.parse(fileContent)

    if (type === 'pricing') {
      content.robux_packages = newData
    } else if (type === 'assets') {
      content.avatar_services = newData
    } else if (type === 'general') {
      content.general = { ...content.general, ...newData }
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update content error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
