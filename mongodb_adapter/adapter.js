var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://root:password@172.17.0.1:27017/admin';
var dbName = 'tbap'; 

var connectDB = async function() {
    const client = await MongoClient.connect(url);
    await client.connect();
    return client
}

var insertData = async function(client, collectionName, data) {
    var collection = client.db(dbName).collection(collectionName);
    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents were inserted`);
    return true
}

module.exports = {
    connectDB,
    insertData
};
