// app/api/tasks/counts/route.js
import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabaseClient'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const status = (searchParams.get('status') || 'open').toLowerCase()

    const completed =
      status === 'open' ? false :
      status === 'completed' ? true :
      undefined

    let q = supabase
      .from('tasks')
      .select('collection_id', { count: 'none' }) // stáhneme jen sloupec

    if (completed !== undefined) q = q.eq('is_completed', completed)

    const { data, error } = await q
    if (error) throw error

    // { [collection_id]: count }
    const map = {}
    for (const row of data || []) {
      map[row.collection_id] = (map[row.collection_id] || 0) + 1
    }

    return NextResponse.json(map)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
