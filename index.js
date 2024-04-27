const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require('dotenv').config();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzevybe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const craftcollections = client.db("craftDB").collection("craft");

    app.get('/crafts', async(req,res) => {
        const email = req.params.email;
        if(email){
            const query = {email : email};
            console.log(query);
            const cursor = craftcollections.find(query);
            // const result = await cursor.toArray();
            // res.send(result);
        } else{
            const cursor = craftcollections.find();
            const result = await cursor.toArray();
            res.send(result);
        }
    })
    app.get('/crafts/:id',async(req,res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await craftcollections.findOne(query);
        res.send(result);
    })
    // app.get('/crafts/:email',async(req,res) => {
    //     const email = req.params.email;
    //     const query = {email : email};
    //     const cursor = craftcollections.find(query);
    //     const result = await cursor.toArray();
    //     res.send(result);
    // })
    app.post('/crafts', async(req,res) => {
        const craft = req.body;
        const result = await craftcollections.insertOne(craft);
        res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res) => {
    res.send('Server is running');
})

app.listen(port,() => {
    console.log('server is running on',port);
})