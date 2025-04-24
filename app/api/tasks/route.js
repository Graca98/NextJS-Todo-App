import {createConnection} from '../../../lib/db.js'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const db = await createConnection()
        const sql = "SELECT * FROM tasks"
        const [tasks] = await db.query(sql)
        return NextResponse.json(tasks)
    } catch(error) {
        console.log(error)
        return NextResponse.json({error: error.message})
        
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

        return NextResponse.json({ message: 'Úkol přidán', insertId: result.insertId }, { status: 201 })
    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}