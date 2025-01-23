// lib/db.js
import pg from 'pg';

// Neon.tech-specific optimized configuration
const config = {
    user: 'neondb_owner',
    password: '79CrKItezLUX',
    host: 'ep-cool-hat-a56aqpwl.us-east-2.aws.neon.tech',
    port: 5432,
    database: 'neondb',
    ssl: {
        rejectUnauthorized: false,
        sslmode: 'require'
    },
    // Optimized for serverless databases
    max: 10, // Reduced from 20 for serverless
    idleTimeoutMillis: 15000, // Reduced timeout
    connectionTimeoutMillis: 3000,
    allowExitOnIdle: true
};

const pool = new pg.Pool(config);

// Connection lifecycle logging
pool.on('connect', () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('New database connection established');
    }
});

pool.on('error', (err) => {
    console.error('Database connection error:', {
        message: err.message,
        code: err.code
    });
});

export const db = {
    query: async (sql, params = []) => {
        try {
            const result = await pool.query(sql, params);
            return result.rows;
        } catch (error) {
            console.error('Database query failed:', {
                query: sql.substring(0, 100),
                params: params.slice(0, 3), // Log first 3 params only
                error: error.message
            });
            throw error;
        }
    },

    // Health check specific for Neon.tech
    checkHealth: async () => {
        try {
            await pool.query('SELECT 1');
            return true;
        } catch (error) {
            return false;
        }
    }
};

// Initial connection test
db.checkHealth()
    .then(healthy => console.log(healthy ?
        'Connected to Neon.tech database' :
        'Connection failed'
    ));