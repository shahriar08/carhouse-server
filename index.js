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
        const usersCollection = database.collection('users');
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

        app.get('/orders',async (req,res) =>{
            const email = req.query.email;
            const query = {email: email}
            const cursor= orderCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders)
        })

        app.post('/orders',async (req,res) =>{
            const order= req.body;
            const result= await orderCollection.insertOne(order);
            console.log(result);
            res.json(result)
        });


        app.post('/addCar',async (req,res) =>{
            const newCar= req.body;
            const result= await carCollection.insertOne(newCar);
            console.log(result);
            res.json(result)
        });
        
        app.post('/users',async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        app.put('/users',async (req,res)=>{
            const user = req.body;
            const filter = {email: user.email};
            const options = { upsert: true};
            const updateDoc = {$set: user};
            const result = usersCollection.updateOne(filter,updateDoc,options);
                res.json(result);
        })
        app.get('/users/:email', async(req,res) =>{
            const email = req.params.email;
            const query = {email: email};
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if(user?.role === 'admin'){
                isAdmin= true;
            }
            res.json({admin: isAdmin});
        })
        app.put('/users/admin',async(req,res)=>{
            const user = req.body; 
            const filter = {email: user.email};
            const updateDoc = {$set: {role: 'admin'}};
            const result = await usersCollection.updateOne(filter,updateDoc);
            res.json(result);

        })
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