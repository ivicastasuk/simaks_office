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
        throw error;
    }
}

// funkcija za azuriranje podataka u bazi
async function updateData(tableName, data, conditionString, conditionValues) {
    let connection;
    try {
        connection = await connect();

        // Validate input parameters
        if (!tableName || typeof tableName !== 'string') {
            throw new Error('Invalid table name');
        }
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
            throw new Error('Data must be a non-empty object');
        }
        if (!conditionString || typeof conditionString !== 'string') {
            throw new Error('Condition string must be a non-empty string');
        }
        if (!Array.isArray(conditionValues)) {
            throw new Error('Condition values must be an array');
        }

        // Prepare the SET clause
        const keys = Object.keys(data);
        const values = Object.values(data);

        const setClause = keys.map(key => `\`${key}\` = ?`).join(', ');

        // Combine values for the query
        const queryValues = [ ...values, ...conditionValues ];

        // Construct the SQL query
        const query = `UPDATE \`${tableName}\` SET ${setClause} WHERE ${conditionString}`;

        // Execute the query
        const [ result ] = await connection.execute(query, queryValues);
        return result;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Funkcija za čitanje podataka iz baze
async function fetchData(tableName, columns = '*', condition = '') {
    let connection;

    try {
        if (!tableName) {
            throw new Error('Table name is required');
        }
        // Formiranje SQL upita na osnovu unetih parametara
        const query = `SELECT ${columns} FROM ${tableName} ${condition}`;
        connection = await connect();
        const [ rows ] = await connection.query(query);
        return rows;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Propagiranje greške kako bi se moglo dalje rukovati
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
module.exports = { connect, fetchData, insertData, updateData };
