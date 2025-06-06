import { NextResponse } from "next/server";
import { supabase } from '../../../../lib/supabaseClient.js';

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const updateFields = {};
    ['name', 'is_completed', 'due_date', 'important', 'priority', 'reminder_at'].forEach(field => {
      if (body[field] !== undefined) {
        updateFields[field] = body[field];
      }
    });

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'No fields provided for update' }, { status: 400 });
    }

    const { error } = await supabase
      .from('tasks')
      .update(updateFields)
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Task updated' });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


//? old sql
// import { pool } from '../../../../lib/db.js';
// import { NextResponse } from "next/server";

// export async function DELETE(req, { params }) {
//   try {
//     const { id } = params;

//     const sql = `DELETE FROM tasks WHERE id = ?`;
//     const [result] = await pool.execute(sql, [id]);

//     return NextResponse.json({
//       message: "Task deleted",
//       affectedRows: result.affectedRows,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function PATCH(req, { params }) {
//   try {
//     const { id } = params;
//     const body = await req.json();

//     const allowedFields = ['name', 'is_completed', 'due_date', 'important', 'priority', 'reminder_at'];
//     const fields = [];
//     const values = [];

//     for (const key of allowedFields) {
//       if (body[key] !== undefined) {
//         fields.push(`${key} = ?`);
//         values.push(body[key]);
//       }
//     }

//     if (fields.length === 0) {
//       return NextResponse.json({ error: 'No fields provided for update' }, { status: 400 });
//     }

//     const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
//     values.push(id);

//     const [result] = await pool.execute(sql, values);

//     return NextResponse.json({
//       message: 'Task updated',
//       changedFields: fields.length,
//       affectedRows: result.affectedRows
//     });
//   } catch (error) {
//     console.error('PATCH error:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
