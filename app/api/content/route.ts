import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  try {
    if (type === 'gallery') {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return NextResponse.json(data || [])
    }
    
    // Fetch all content
    const { data: pricing, error: pError } = await supabase.from('pricing').select('*').order('created_at', { ascending: true })
    const { data: assets, error: aError } = await supabase.from('assets').select('*').order('created_at', { ascending: true })
    
    if (pError || aError) throw (pError || aError)

    return NextResponse.json({
      robux_packages: pricing || [],
      avatar_services: assets || [],
      general: {}
    })
  } catch (error: any) {
    console.error('Supabase Fetch Content Error:', error)
    return NextResponse.json({
      robux_packages: [],
      avatar_services: [],
      general: {}
    }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const { type, data: newData } = await request.json()

    if (type === 'gallery') {
      // Gallery usually is an array of items
      // We'll delete and re-insert for simplicity in this admin context, 
      // or handle upserts if data has IDs.
      await supabase.from('gallery').delete().neq('id', '00000000-0000-0000-0000-000000000000') // Clear all
      const { error } = await supabase.from('gallery').insert(newData)
      if (error) throw error
      return NextResponse.json({ success: true })
    }

    if (type === 'pricing') {
      await supabase.from('pricing').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      const { error } = await supabase.from('pricing').insert(newData)
      if (error) throw error
    } else if (type === 'assets') {
      await supabase.from('assets').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      const { error } = await supabase.from('assets').insert(newData)
      if (error) throw error
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Supabase Update Content Error:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}
