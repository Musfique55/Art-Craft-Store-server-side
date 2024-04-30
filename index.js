const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");

const corsOpts = {
    origin: ['http://localhost:5173'],
    methods: [
    'GET',
    'POST',
    'PATCH',
    'PUT',
    'DELETE',
    'OPTIONS'
],
    allowedHeaders: [
    'Content-Type',
    ],
};
app.use(cors(corsOpts));
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
    const craftcollections = client.db("craftDB").collection("craft");
    const categoriesDB = client.db("SubcategoriesDB").collection("subcategories");

    app.get('/crafts', async(req,res) => {
            const cursor = craftcollections.find();
            const result = await cursor.toArray();
            res.send(result);
    })

    app.get('/subcategories', async(req,res) => {
        const cursor = categoriesDB.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/items/:category', async(req,res) => {
        const category = req.params.category;
        const query = {subcategory : category}
        const result = await craftcollections.find(query).toArray();
        res.send(result);
    })
    app.get('/crafts/:id',async(req,res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await craftcollections.findOne(query);
        res.send(result);
    })
    app.get('/craft/:email',async(req,res) => {
        const email = req.params.email;
        const query = {email : email};
        const cursor = craftcollections.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })
    app.put('/crafts/:id', async(req,res) => {
        const id = req.params.id;
        const item = req.body;
        const filter = {_id : new ObjectId(id)};
        console.log(item,filter);
        const options = { upsert: true };
        const update = {
            $set : {   
                    image : item.image,
                    itemName : item.itemName,
                    subcategory : item.subcategory,
                    description : item.description,
                    price : item.price,
                    rating : item.rating,
                    agreement : item.agreement,
                    processTime : item.processTime,
                    stockcheck : item.stockcheck
            }
        };
        const result = await craftcollections.updateOne(filter,update,options);
        res.send(result);
    })
    app.post('/crafts', async(req,res) => {
        const craft = req.body;
        const result = await craftcollections.insertOne(craft);
        res.send(result);
    })
    app.delete('/crafts/:id',async (req,res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await craftcollections.deleteOne(query);
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