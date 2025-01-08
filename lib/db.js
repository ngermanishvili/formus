// lib/db.js
import mysql from 'mysql2/promise';

class Database {
    static instance = null;
    connection = null;

    constructor() {
        const config = {
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'gldani',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        };

        this.connection = mysql.createPool({
            host: config.host,
            database: config.database,
            user: config.user,
            password: config.password,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    async query(sql, values) {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }

        try {
            const [rows] = await this.connection.execute(sql, values);
            return rows;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }
}

// Export a singleton instance
export const db = Database.getInstance();