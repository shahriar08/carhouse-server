// database=carHouseDB
// collection=car-collection

const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.suh58.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('carHouseDB');
        const carCollection = database.collection('products');
        const ratingCollection = database.collection('ratings')
        const orderCollection = database.collection('orders')
        // car collection
        app.get('/car-collection', async (req, res) => {
            const cursor = carCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        // ratings
        app.get('/ratings', async (req, res) => {
            const cursor = ratingCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })


        app.post('/orders',async (req,res) =>{
            const order= req.body;
            const result= await orderCollection.insertOne(order);
            res.json(result)
        });

    }
    finally {

    }
}

run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Server Running');
});
app.listen(port, () => {
    console.log('server running at port', port)
}) 