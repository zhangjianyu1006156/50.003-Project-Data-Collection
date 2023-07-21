const mongoAdapter = require("./adapter");

describe('MongoDB connection test', () => {
    let client; 
    jest.setTimeout(80000);
    
    beforeAll(async () => {
        client = await mongoAdapter.connectDB();
    })

    test('Connection test', async () => {  
        const data = {name: "John Doe", age: 30};
        let status = await mongoAdapter.insertData(client, 'test', data);

        expect(status).toBe(true);
  
    }, 70000);
  });