import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'gallery.json')

export async function GET() {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const newItem = await request.json()
    const data = await fs.readFile(DATA_PATH, 'utf-8')
    const gallery = JSON.parse(data)
    
    // Add new item with a unique ID
    const itemWithId = {
      ...newItem,
      id: Date.now()
    }
    
    gallery.unshift(itemWithId) // Add to the beginning
    
    await fs.writeFile(DATA_PATH, JSON.stringify(gallery, null, 2))
    return NextResponse.json(itemWithId)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const data = await fs.readFile(DATA_PATH, 'utf-8')
    let gallery = JSON.parse(data)
    
    gallery = gallery.filter((item: any) => item.id !== id)
    
    await fs.writeFile(DATA_PATH, JSON.stringify(gallery, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
