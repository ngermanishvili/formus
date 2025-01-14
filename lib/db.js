// lib/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'buildings_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function query(sql, values = []) {
    const [results] = await pool.execute(sql, values);
    return results;
}

export const db = {
    query
};