const mongoAdapter = require("./adapter");

describe('MongoDB connection test', () => {
    let client; 
    const mockData = {name: "John Doe", age: 30};
    jest.setTimeout(80000);
    
    beforeAll(async () => {
        client = await mongoAdapter.connectDB();
    })

    afterAll (async () => {
        await client.close();
    })

    test('MGA_CN: Connection test', async () => {  
        let status = await mongoAdapter.insertData(client, 'test', mockData);

        expect(status).toBe(true);
  
    }, 70000);

    test ('MGA_D: Correct data', async() => {
        var collection = client.db('tbap').collection('test');
        const insertedData = await collection.findOne({name: 'John Doe'});

        expect(insertedData).toEqual(mockData);
    }, 70000);
  });