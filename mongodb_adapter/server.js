const express = require('express');
const app = express();
var dbAdapter = require('./adapter');

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/data', (req, res) => {
  console.log('Running /sad');
  var data = [{name: "John Doe", age: 30}, {name: "Jane Doe", age: 28}];
  dbAdapter.connectDB().then(client => {
    dbAdapter.insertData(client, 'users', data).then(_ => {
      console.log("Data written successfully");
    });
  });
  res.send("Done")
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
