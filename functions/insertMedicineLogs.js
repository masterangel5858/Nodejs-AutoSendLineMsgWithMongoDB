const { connectToDatabase, DisconnectToDatabase, client, dbName } = require('./connecteddatabase');
const { MongoClient } = require("mongodb");

async function insertData(data) {
    try {
        await connectToDatabase();
        console.log('try to insert data');
        const db = client.db(dbName);
        const col = db.collection("MedicineLogs");

        // Check if data is an array
        if (Array.isArray(data) && data.length > 1) {
            // Use insertMany if data is an array with more than one element
            const result = await col.insertMany(data);
            console.log(`Inserted ${result.insertedCount} documents into the collection.`);
        } else {
            // Use insertOne for single data or empty data array
            const result = await col.insertOne(data);
            console.log(`Inserted ${result.insertedCount} document into the collection.`);
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
