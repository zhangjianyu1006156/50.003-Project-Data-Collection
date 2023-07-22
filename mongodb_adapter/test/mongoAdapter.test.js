const mongoAdapter = require("../adapter");

describe('MongoDB connection test', () => {
    let client; 
    
    beforeAll(async () => {
        client = await mongoAdapter.connectDB();
    })

    afterAll(async () => {
        client.close();
    })

    it ('MGA_CN: Connection test', async () => {  
        let status = await mongoAdapter.insertData(client, 'connectTest', [{connect: true}]);

        await client.db('tbap').collection('connectTest').drop();
        expect(status).toBe(true);
  
    }, 70000);

    it ('MGA_D: Correct data', async() => {
        const mockData = [{_id: "user_id", name: 'John Doe'}];
        await mongoAdapter.insertData(client, 'insertDataTest', mockData);

        var collection = client.db('tbap').collection('insertDataTest');
        const insertedData = await collection.findOne({name: 'John Doe'});

        await client.db('tbap').collection('insertDataTest').drop();
        expect([insertedData]).toEqual(mockData);

    }, 70000);
  });