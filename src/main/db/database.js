const { createConnection } = require('mysql2/promise');
const config = require('../config');

// // Objekat za konfiguraciju konekcije
// const dbConfig = {
//     host: 'localhost',
//     port: '3307',
//     user: 'liridenet',
//     password: 'liridenetns',
//     database: 'simaks_office'
// };

// Funkcija za konekciju na bazu
async function connect() {
    try {
        const connection = await createConnection(config.db);
        console.log('Successfully connected to the database');
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

// Funkcija za azuriranje podataka u bazi
async function updateData(tableName, data, conditionString, conditionValues) {
    let connection;
    try {
        connection = await connect();

        // Validacija unesenih parametara
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

        const keys = Object.keys(data);
        const values = Object.values(data);

        const setClause = keys.map(key => `\`${key}\` = ?`).join(', ');

        // Kombinovanje vrednosti za upit
        const queryValues = [ ...values, ...conditionValues ];

        // Kreiranje SQL upita
        const query = `UPDATE \`${tableName}\` SET ${setClause} WHERE ${conditionString}`;

        // Izvrsavanje upita
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
            throw new Error('Invalid table name or data object');
        }

        // Provera da su svi ključevi stringovi i da data sadrži vrednosti
        const keys = Object.keys(data);
        if (!keys.every(key => typeof key === 'string')) {
            throw new Error('Invalid data keys, expected strings');
        }

        const values = keys.map(key => data[ key ]);
        const placeholders = keys.map(() => '?').join(', ');
        const columnNames = keys.join(', ');

        // Kreiranje i izvršavanje SQL upita
        const query = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`;
        const [ result ] = await connection.execute(query, values);  // Koristimo destructuring da dobijemo samo prvi element iz niza

        // Vraćanje rezultata, npr. `insertId` ili broj zahvaćenih redova
        return {
            insertId: result.insertId,
            affectedRows: result.affectedRows,
            message: 'Insert successful'
        };
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Funkcija za brisanje podataka iz baze
async function deleteData(tableName, conditionString, conditionValues) {
    let connection;
    try {
        connection = await connect();

        // Validacija ulaznih parametara
        if (!tableName || typeof tableName !== 'string') {
            throw new Error('Invalid table name');
        }
        if (!conditionString || typeof conditionString !== 'string') {
            throw new Error('Condition string must be a non-empty string');
        }
        if (!Array.isArray(conditionValues)) {
            throw new Error('Condition values must be an array');
        }

        // Kreiranje i izvršavanje SQL upita
        const query = `DELETE FROM \`${tableName}\` WHERE ${conditionString}`;
        const [ result ] = await connection.execute(query, conditionValues);
        return result;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}


// Funkcija za dobijanje potencijalnog sledećeg broja ponude
async function getPotentialOfferNumber() {
    let connection;
    try {
        connection = await connect();

        const currentYear = new Date().getFullYear();
        let query = 'SELECT MAX(broj) as maxBroj FROM offer_numbers WHERE godina = ?';
        let [ rows ] = await connection.execute(query, [ currentYear ]);

        let maxBroj = rows[ 0 ].maxBroj || 0;
        let potentialNumber = parseInt(maxBroj, 10) + 1;

        return { godina: currentYear, broj: potentialNumber };
    } catch (error) {
        console.error('Error getting potential offer number:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Funkcija za rezervisanje broja ponude
async function reserveOfferNumber(expectedNumber) {
    let connection;
    try {
        connection = await connect();

        const currentYear = new Date().getFullYear();

        await connection.beginTransaction();

        // Zakljucavanje reda za unos
        let query = 'SELECT MAX(broj) as maxBroj FROM offer_numbers WHERE godina = ? FOR UPDATE';
        let [ rows ] = await connection.execute(query, [ currentYear ]);

        let maxBroj = rows[ 0 ].maxBroj || 0;
        let nextNumber = parseInt(maxBroj, 10) + 1;

        let finalNumber;

        if (nextNumber === expectedNumber) {
            finalNumber = expectedNumber;
        } else {
            finalNumber = nextNumber;
        }

        if (maxBroj) {
            // Rezervacija novog broja u godini
            query = 'UPDATE offer_numbers SET broj = ? WHERE godina = ?';
            await connection.execute(query, [ finalNumber, currentYear ]);
        } else {
            // Ubacivanje novog broja u godinu
            query = 'INSERT INTO offer_numbers (godina, broj) VALUES (?, ?)';
            await connection.execute(query, [ currentYear, finalNumber ]);
        }

        await connection.commit();

        return { godina: currentYear, broj: finalNumber };
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error reserving offer number:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Snimanje ponude u bazu
async function saveOfferToDatabase(offerData) {
    let connection;
    try {
        connection = await connect();

        await connection.beginTransaction();

        // Ubacivanje podataka u tabelu "offers"
        const offerQuery = `
            INSERT INTO offers (
                offer_number, offer_year, client_name, client_address, client_city, client_pib, client_mb,
                total_amount, total_vat, total_with_vat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const offerValues = [
            offerData.offerNumber,
            offerData.offerYear,
            offerData.clientName,
            offerData.clientAddress,
            offerData.clientCity,
            offerData.clientPIB,
            offerData.clientMB,
            offerData.totalAmount,
            offerData.totalVAT,
            offerData.totalWithVAT
        ];

        const [ offerResult ] = await connection.execute(offerQuery, offerValues);
        const offerId = offerResult.insertId;

        // Ubacivanje stavki u tabelu "offer_items"
        const itemQuery = `
            INSERT INTO offer_items (
                offer_id, code, description, unit, quantity, price, discount, price_with_discount, amount, vat_percent, vat_amount, total
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        for (const item of offerData.items) {
            const itemValues = [
                offerId,
                item.code,
                item.description,
                item.unit,
                item.quantity,
                item.price,
                item.discount,
                item.priceWithDiscount,
                item.amount,
                item.vatPercent,
                item.vatAmount,
                item.total
            ];

            await connection.execute(itemQuery, itemValues);
        }

        await connection.commit();

        return { success: true, offerId };
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error saving offer to database:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function checkForDuplicateProduct(code, model) {
    const connection = await connect();

    // Provera postojanja šifre
    const [ codeRows ] = await connection.execute(
        'SELECT COUNT(*) as count FROM products WHERE code = ?',
        [ code ]
    );
    const codeExists = codeRows[ 0 ].count > 0;

    // Provera postojanja oznake
    const [ modelRows ] = await connection.execute(
        'SELECT COUNT(*) as count FROM products WHERE model = ?',
        [ model ]
    );
    const modelExists = modelRows[ 0 ].count > 0;

    await connection.end();

    return { codeExists, modelExists };
}

// export default
module.exports = { connect, fetchData, insertData, updateData, deleteData, getPotentialOfferNumber, reserveOfferNumber, saveOfferToDatabase, checkForDuplicateProduct };
