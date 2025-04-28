import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db.js';

export async function GET() {
  try {
    const [collections] = await pool.query(
      'SELECT id, name FROM collections WHERE user_id = ?',
      [1] // ID uživatele -> později změnit podle DB
    );

    return NextResponse.json(collections);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
