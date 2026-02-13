import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient.js';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get('collection_id');

    if (!collectionId) {
      return NextResponse.json({ error: 'collection_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('collection_id', collectionId)
      .order('important', { ascending: false })
      .order('due_date', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      collection_id,
      name,
      due_date,
      important,
      priority,
      reminder_at
    } = body;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        collection_id,
        name,
        due_date,
        important,
        priority,
        reminder_at
      }])
      .select('*')
      .single();

    if (error) throw error;

    // Volitelně archivace do logu (pokud máš tabulku tasks_log)
    await supabase
      .from('tasks_log')
      .insert([{
        collection_id,
        name,
        due_date,
        important,
        priority,
        reminder_at,
        created_at: new Date().toISOString()
      }]);

    return NextResponse.json({ message: 'Úkol přidán', data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




//? old mysql
// import { pool } from '../../../lib/db.js';
// import { NextResponse } from 'next/server'

// //todo zrychlit práci v mysql držením připojení v "poolu" místo stáleho vytváření novohé připojení

// // export async function GET() {
// //     try {
// //         const db = await createConnection()
// //         const sql = "SELECT * FROM tasks"
// //         const [tasks] = await db.query(sql)
// //         return NextResponse.json(tasks)
// //     } catch(error) {
// //         console.log(error)
// //         return NextResponse.json({error: error.message})
        
// //     }
// // }

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const collectionId = searchParams.get('collection_id');

//     if (!collectionId) {
//       return NextResponse.json({ error: 'collection_id is required' }, { status: 400 });
//     }

//     const [tasks] = await pool.execute('SELECT * FROM tasks WHERE collection_id = ?', [collectionId]);
//     return NextResponse.json(tasks);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const {
//       collection_id,
//       name,
//       due_date,
//       important,
//       priority,
//       reminder_at
//     } = body;

//     const sql = `
//       INSERT INTO tasks (collection_id, name, due_date, important, priority, reminder_at)
//       VALUES (?, ?, ?, ?, ?, ?)
//     `;
//     const [result] = await pool.execute(sql, [
//       collection_id,
//       name,
//       due_date,
//       important,
//       priority,
//       reminder_at
//     ]);

//     // Archivace do tasks_log
//     const sqlLog = `
//       INSERT INTO tasks_log (collection_id, name, due_date, important, priority, reminder_at, created_at)
//       VALUES (?, ?, ?, ?, ?, ?, NOW())
//     `;
//     await pool.execute(sqlLog, [
//       collection_id,
//       name,
//       due_date,
//       important,
//       priority,
//       reminder_at
//     ]);

//     return NextResponse.json({ message: 'Úkol přidán', insertId: result.insertId }, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }