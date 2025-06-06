import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient.js';

// Get collections by user_id
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('id, name')
      .eq('user_id', 1)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Přidání kolekce
export async function POST(req) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('collections')
      .insert([{ user_id: 1, name }])
      .select('id, name')
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Mazání kolekce
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Kolekce smazána' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Úprava názvu kolekce
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, name } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'ID a nový název je nutný' }, { status: 400 });
    }

    const { error } = await supabase
      .from('collections')
      .update({ name })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Kolekce upravena' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


//? Mysql workbench
// import { NextResponse } from 'next/server';
// import { pool } from '../../../lib/db.js';

// export async function GET() {
//   try {
//     const [collections] = await pool.query(
//       'SELECT id, name FROM collections WHERE user_id = ?',
//       [1] // ID uživatele -> později změnit podle DB
//     );

//     return NextResponse.json(collections);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // Přidání kolekce
// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { name } = body;

//     if (!name) {
//       return NextResponse.json({ error: 'Name is required' }, { status: 400 });
//     }

//     const [result] = await pool.execute('INSERT INTO collections (user_id, name) VALUES (?, ?)', [1, name]);
//     return NextResponse.json({ id: result.insertId, name }, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // Mazání kolekce
// export async function DELETE(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get('id');

//     if (!id) {
//       return NextResponse.json({ error: 'ID is required' }, { status: 400 });
//     }

//     await pool.execute('DELETE FROM collections WHERE id = ?', [id]);
//     return NextResponse.json({ message: 'Kolekce smazána' });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // Úprava názvu kolekce
// export async function PATCH(req) {
//   try {
//     const body = await req.json();
//     const { id, name } = body;

//     if (!id || !name) {
//       return NextResponse.json({ error: 'ID a nový název je nutný' }, { status: 400 });
//     }

//     await pool.execute('UPDATE collections SET name = ? WHERE id = ?', [name, id]);
//     return NextResponse.json({ message: 'Kolekce upravena' });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
