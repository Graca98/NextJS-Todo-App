import mysql from 'mysql2/promise';

// Vytvoříme jednou pool (ne connection)
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Kolik maximálně spojení držet v poolu
  queueLimit: 0
});

// Exportujeme pool
export { pool };



// import mysql from 'mysql2/promise'

// let connection;
// export const createConnection = async () => {
//     if(!connection) {
//         connection = await mysql.createConnection({
//             host: process.env.DATABASE_HOST,
//             user: process.env.DATABASE_USER,
//             password: process.env.DATABASE_PASSWORD,
//             database: process.env.DATABASE_NAME
//         })
//     }
//     return connection;
// }