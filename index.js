const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
const uri = "mongodb+srv://Nazmul_Hasan_Palash:JjM2NX9ly2JCozUa@cluster0.pfvsy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('Cyber-Security');
        const servicesCollection = database.collection('services');
        const myOrdersCollection = database.collection('myOrders');
        const reviewCollection = database.collection('review');



        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        //GET API email and username
        app.get('/placeOrders', async (req, res) => {
            const cursor = placeOrdersCollection.find({});
            const placeOrders = await cursor.toArray();
            res.send(placeOrders);
        });
        app.get('/myOrders', async (req, res) => {
            const cursor = myOrdersCollection.find({});
            const myOrders = await cursor.toArray();
            res.send(myOrders);
        });
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        app.get('/myOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await myOrdersCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(user);
        })
        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(review);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
        //POST API email and username

        app.post('/myOrders', async (req, res) => {
            const newUser = req.body;
            const result = await myOrdersCollection.insertOne(newUser);
            console.log('got new user', req.body);
            console.log('added user', result);
            res.json(result);
        });
        //UPDATE API Manage  Orders
        app.put('/myOrders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    pending: updatedUser.pending,
                },
            };
            const result = await myOrdersCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })
        app.post('/review', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            console.log('got new bike', req.body);
            console.log('added nike', result);
            res.json(result);
        });

        // DELETE API
        app.delete('/myOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myOrdersCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close(;
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Cyber Security');
});

app.listen(port, () => {
    console.log('Cyber Security on port', port);
})