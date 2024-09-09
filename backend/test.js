const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://bsaalberg:simple@cluster0.mongodb.net/<crossword-ai>?authSource=admin&authMechanism=SCRAM-SHA-256&retryWrites=true&w=majority';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  console.log('Starting connection attempt...');
  try {
    await client.connect();
    console.log('Connected successfully to server');
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    console.log('Closing connection...');
    await client.close();
    console.log('Connection closed.');
  }
}

run().catch(console.dir);
