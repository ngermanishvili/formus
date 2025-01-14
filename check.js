// check-migration.js
import pg from 'pg';

const client = new pg.Client({
    connectionString: 'postgresql://neondb_owner:79CrKItezLUX@ep-cool-hat-a56aqpwl.us-east-2.aws.neon.tech/neondb',
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkMigration() {
    try {
        await client.connect();

        // შევამოწმოთ ყველა ცხრილში ჩანაწერების რაოდენობა
        const tables = ['building_blocks', 'apartment_types', 'apartments', 'floors', 'admin'];

        for (const table of tables) {
            const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
            console.log(`${table}: ${result.rows[0].count} ჩანაწერი`);

            // პირველი ჩანაწერის ნახვა
            const firstRow = await client.query(`SELECT * FROM ${table} LIMIT 1`);
            if (firstRow.rows.length > 0) {
                console.log(`${table}-ის პირველი ჩანაწერი:`, firstRow.rows[0]);
            }
            console.log('------------------------');
        }

    } catch (error) {
        console.error('შეცდომა შემოწმებისას:', error);
    } finally {
        await client.end();
    }
}

checkMigration();