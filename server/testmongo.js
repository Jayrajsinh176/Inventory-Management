const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
"mongodb+srv://netvexa_admin:Netvexa12345@cluster0.mbyss.mongodb.net/inventory_management?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("CONNECTED SUCCESSFULLY");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();