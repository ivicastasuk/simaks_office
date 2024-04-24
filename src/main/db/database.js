const { createConnection } = require('mysql2/promise');

// Objekat za konfiguraciju konekcije
const dbConfig = {
    host: 'localhost',
    port: '3307',
    user: 'liridenet',
    password: 'liridenetns',
    database: 'simaks_office'
};

// Funkcija za konekciju na bazu
async function connect() {
    try {
        const connection = await createConnection(dbConfig);
        console.log('Successfully connected to the database');
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

// Funkcija za čitanje podataka iz baze
async function fetchData() {
    let connection;

    try {
        connection = await connect();
        const [ rows, fields ] = await connection.query('SELECT * FROM users');
        return rows;
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Funkcija za upis podataka u bazu
async function insertData(tableName, data) {
    let connection;
    try {
        connection = await connect();
        // Validacija ulaznih podataka
        if (!tableName || typeof data !== 'object' || Object.keys(data).length === 0) {
            throw new Error('Invalid table name or columns');
        }

        // Priprema delova upita
        const keys = Object.keys(data);
        const values = keys.map(key => data[ key ]);
        const placeholders = keys.map(() => '?').join(', ');  // Kreira string placeholdera
        const columnNames = keys.join(', ');

        // Kreiranje i izvršavanje SQL upita
        const query = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`;
        const result = await connection.execute(query, values);
        return result;
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// export default { connect, fetchData, insertData };
module.exports = { connect, fetchData, insertData };
