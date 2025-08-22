// app/api/tasks/count/route.js
import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabaseClient'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const collectionId = searchParams.get('collectionId') || searchParams.get('collection_id')
    const status = (searchParams.get('status') || 'open').toLowerCase()

    if (!collectionId) {
      return NextResponse.json({ error: 'collectionId/collection_id is required' }, { status: 400 })
    }

    const completed =
      status === 'open' ? false :
      status === 'completed' ? true :
      undefined

    let q = supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('collection_id', collectionId)

    // POZOR: používej tvůj název sloupce (u tebe je to "is_completed")
    if (completed !== undefined) q = q.eq('is_completed', completed)

    const { count, error } = await q
    if (error) throw error

    return NextResponse.json({ count: count ?? 0 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
