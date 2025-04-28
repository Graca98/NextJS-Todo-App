import {createConnection} from '../../../lib/db.js'
import { NextResponse } from 'next/server'

// export async function GET() {
//     try {
//         const db = await createConnection()
//         const sql = "SELECT * FROM tasks"
//         const [tasks] = await db.query(sql)
//         return NextResponse.json(tasks)
//     } catch(error) {
//         console.log(error)
//         return NextResponse.json({error: error.message})
        
//     }
// }

export async function GET(req) {
  try {
    const db = await createConnection();
    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get('collection_id');

    if (!collectionId) {
      return NextResponse.json({ error: 'collection_id is required' }, { status: 400 });
    }

    const sql = "SELECT * FROM tasks WHERE collection_id = ?";
    const [tasks] = await db.execute(sql, [collectionId]);

    return NextResponse.json(tasks);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(request) {
    try {
        const db = await createConnection()
        const body = await request.json()

        const {
            collection_id,
            name,
            due_date,
            important,
            priority,
            reminder_at
        } = body

        // Hlavní db
        const sql = `
            INSERT INTO tasks (collection_id, name, due_date, important, priority, reminder_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `
        const [result] = await db.execute(sql, [
            collection_id,
            name,
            due_date,
            important,
            priority,
            reminder_at
        ])

        // Zápis do "archivu" 
        const sqlLog = `
            INSERT INTO tasks_log (collection_id, name, due_date, important, priority, reminder_at, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `
        await db.execute(sqlLog, [
            collection_id,
            name,
            due_date,
            important,
            priority,
            reminder_at
        ])

        return NextResponse.json({ message: 'Úkol přidán', insertId: result.insertId }, { status: 201 })
    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}