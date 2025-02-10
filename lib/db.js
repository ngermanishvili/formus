// lib/db.js
import pg from 'pg';

const config = {
    user: 'neondb_owner',
    password: '79CrKItezLUX',
    host: 'ep-cool-hat-a56aqpwl.us-east-2.aws.neon.tech',
    port: 5432,
    database: 'neondb',
    ssl: {
        rejectUnauthorized: false
    }
};

// console.log('Initializing database connection with config:', {
//     ...config,
//     password: '***' // არ ვაჩვენებთ პაროლს ლოგებში
// });

const pool = new pg.Pool(config);

pool.on('connect', (client) => {
    console.log('New client connected to database');
});

pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
});

pool.on('acquire', (client) => {
    console.log('Client acquired from pool');
});

pool.on('remove', (client) => {
    console.log('Client removed from pool');
});

export async function query(sql, params = []) {
    let client;
    try {
        client = await pool.connect();
        console.log('Successfully connected to database');

        const result = await client.query(sql, params);
        console.log('Query executed successfully', {
            rowCount: result.rowCount,
            firstRow: result.rows[0] ? '...exists' : 'null'
        });

        return result.rows;
    } catch (error) {
        console.error('Database error details:', {
            message: error.message,
            code: error.code,
            detail: error.detail,
            hint: error.hint,
            position: error.position
        });
        throw error;
    } finally {
        if (client) {
            console.log('Releasing client back to pool');
            client.release();
        }
    }
}

// Test connection on startup
pool.query('SELECT NOW()')
    .then(() => console.log('Database connection test successful'))
    .catch(err => console.error('Database connection test failed:', err));

export const db = {
    query
};