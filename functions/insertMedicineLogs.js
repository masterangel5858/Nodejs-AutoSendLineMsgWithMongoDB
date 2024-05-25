const { connectToDatabase, DisconnectToDatabase, client, dbName } = require('./connecteddatabase');
const { MongoClient } = require("mongodb");

async function insertData(data) {
    try {
        await connectToDatabase();
        console.log('Trying to insert data');

        const db = client.db(dbName);
        const col = db.collection("MedicineLogs");

        // Check the type of data before attempting insertion
        console.log('Data type:', Array.isArray(data) ? 'Array' : typeof data);
        console.log('Data:', JSON.stringify(data, null, 2));

        if (Array.isArray(data)) {
            if (data.length > 0 && data.every(item => typeof item === 'object' && item !== null)) {
                // Use insertMany if data is an array with one or more elements
                const result = await col.insertMany(data);
                console.log(`Inserted ${result.insertedCount} documents into the collection.`);
            } else {
                throw new Error('Array is empty or contains invalid elements');
            }
        } else if (typeof data === 'object' && data !== null) {
            // Use insertOne if data is a single object
            const result = await col.insertOne(data);
            console.log(`Inserted ${result.insertedCount} document into the collection.`);
        } else {
            throw new Error('Data must be an object or an array of objects');
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    } finally {
        await DisconnectToDatabase();
    }
}

module.exports = {
    insertData
};
