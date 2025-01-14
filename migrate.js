import mysql from 'mysql2/promise';
import pg from 'pg';
import { config } from 'dotenv';

config();

// MySQL connection
const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'buildings_db'
};

// PostgreSQL connection
const pgConfig = {
    connectionString: 'postgresql://neondb_owner:79CrKItezLUX@ep-cool-hat-a56aqpwl.us-east-2.aws.neon.tech/neondb?sslmode=require'
};

async function migrate() {
    // Connect to both databases
    const mysqlConn = await mysql.createConnection(mysqlConfig);
    const pgClient = new pg.Client(pgConfig);
    await pgClient.connect();

    try {
        // Set timezone to UTC
        await pgClient.query("SET timezone = 'UTC';");

        // Drop existing tables in reverse order of dependencies
        await pgClient.query(`
            DROP TABLE IF EXISTS admin CASCADE;
            DROP TABLE IF EXISTS apartment_images CASCADE;
            DROP TABLE IF EXISTS apartments CASCADE;
            DROP TABLE IF EXISTS floors CASCADE;
            DROP TABLE IF EXISTS apartment_types CASCADE;
            DROP TABLE IF EXISTS building_blocks CASCADE;
        `);

        // Create tables in PostgreSQL
        await pgClient.query(`
            CREATE TABLE building_blocks (
                block_id VARCHAR(1) PRIMARY KEY,
                block_name VARCHAR(50),
                total_floors INTEGER,
                apartments_per_floor INTEGER
            );

            CREATE TABLE apartment_types (
                type_id INTEGER PRIMARY KEY,
                total_area DECIMAL(10,2) NOT NULL,
                studio_area DECIMAL(10,2),
                bedroom_area DECIMAL(10,2),
                bedroom2_area DECIMAL(10,2),
                bedroom3_area DECIMAL(10,2),
                bathroom_area DECIMAL(10,2),
                bathroom2_area DECIMAL(10,2),
                living_room_area DECIMAL(10,2),
                balcony_area DECIMAL(10,2),
                balcony2_area DECIMAL(10,2),
                polygon_coords TEXT
            );

            CREATE TABLE apartments (
                apartment_id INTEGER PRIMARY KEY,
                block_id VARCHAR(1) REFERENCES building_blocks(block_id),
                apartment_number VARCHAR(10) NOT NULL,
                floor INTEGER NOT NULL,
                type_id INTEGER REFERENCES apartment_types(type_id),
                status VARCHAR(20) DEFAULT 'available',
                polygon_coords TEXT,
                UNIQUE(block_id, apartment_number)
            );

            CREATE TABLE floors (
                floor_id INTEGER PRIMARY KEY,
                block_id VARCHAR(1) REFERENCES building_blocks(block_id),
                floor_number INTEGER NOT NULL,
                polygon_coords TEXT,
                title VARCHAR(100),
                status VARCHAR(50) DEFAULT 'available',
                price VARCHAR(50),
                area VARCHAR(50),
                rooms VARCHAR(50),
                UNIQUE(block_id, floor_number)
            );

            CREATE TABLE admin (
                admin_id INTEGER PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE
            );
        `);

        // Migrate data in the correct order
        const tables = ['building_blocks', 'apartment_types', 'apartments', 'floors', 'admin'];

        for (const table of tables) {
            console.log(`Migrating ${table}...`);
            const [rows] = await mysqlConn.query(`SELECT * FROM ${table}`);

            if (rows.length > 0) {
                console.log(`First row of ${table}:`, rows[0]);
                const columns = Object.keys(rows[0]);
                console.log(`Columns for ${table}:`, columns);

                const values = rows.map(row => {
                    const rowValues = Object.values(row).map((val, index) => {
                        if (val === null) return 'NULL';
                        if (val instanceof Date) return `'${val.toISOString()}'`;
                        // Handle is_active conversion from integer to boolean
                        if (columns[index] === 'is_active') return val === 1 ? 'TRUE' : 'FALSE';
                        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                        return val;
                    });
                    return `(${rowValues.join(', ')})`;
                }).join(',\n');

                const insertQuery = `
                    INSERT INTO ${table} (${columns.join(', ')})
                    VALUES ${values}
                    ON CONFLICT DO NOTHING;
                `;

                try {
                    await pgClient.query(insertQuery);
                    console.log(`Successfully migrated ${table}`);
                } catch (error) {
                    console.error(`Error migrating ${table}. Query was:`, insertQuery.substring(0, 1000) + '...');
                    throw error;
                }

                // Create sequence if needed and set its value
                if (table !== 'building_blocks') {
                    const idColumnName = table === 'admin' ? 'admin_id' :
                        table === 'apartment_types' ? 'type_id' :
                            `${table.slice(0, -1)}_id`;

                    const seqName = `${table}_${idColumnName}_seq`;

                    await pgClient.query(`
                        CREATE SEQUENCE IF NOT EXISTS ${seqName};
                        SELECT setval('${seqName}', (SELECT MAX(${idColumnName}) FROM ${table}));
                    `);
                }
            } else {
                console.log(`No data to migrate for ${table}`);
            }
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        await mysqlConn.end();
        await pgClient.end();
    }
}

migrate().catch(console.error);