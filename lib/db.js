// lib/db.js
import mysql from 'mysql2/promise';

class Database {
    static instance = null;
    connection = null;

    constructor() {
        const config = {
            host: '80.241.247.52',
            user: 'velopmentge8ca_city_view',
            password: 'rP9$@iMSA{ZR',
            database: 'velopmentge8ca_db',
            port: 3306
        };

        this.connection = mysql.createPool({
            ...config,
            connectTimeout: 60000,
            waitForConnections: true,
            connectionLimit: 3
        });
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