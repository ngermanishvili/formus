
// lib/db.js
import mysql from 'mysql2/promise';

class Database {
    static instance = null;
    connection = null;

    constructor() {
        this.connection = mysql.createPool(process.env.DATABASE_URL);
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    async query(sql, values) {
        try {
            const [rows] = await this.connection.execute(sql, values);
            return rows;
        } catch (error) {
            console.error('Database error:', error);
            throw error;
        }
    }
}

export const db = Database.getInstance();