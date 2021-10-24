const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");


require('dotenv').config();


const app = express();
const port = 5000;
app.use(cors())
app.use(express.json())

// mIvzSXx9sin8dEwL
//aspin_chakma

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yu5z2.mongodb.net/car-mechanics?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    const successMessage = {
        title: 'You Are Success to get data in root folder bro'
    }
    res.send(successMessage)
})



async function addToDatabase() {
    try {

        await client.connect();
        const database = client.db('car-mechanics');
        const servicesCollection = database.collection('services');

        // GET API

        app.get('/services', async (req, res) => {

            const cursor = servicesCollection.find({});

            const services = await cursor.toArray();
            res.send(services);

        })

        //GET SINGLE SERVICE API 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;


            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            // this is changed by me
            // res.json(service)
            res.send(service)

        })



        // post api 
        app.post('/services', async (req, res) => {
            const service = req.body;
            // const result = await servicesCollection.insertOne(service);
            // console.log(service)
            const result = await servicesCollection.insertOne(service);



            res.json(result)
        })




        // DELETE API 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delete hited with id ', id)
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })

    } finally {
        // await client.close();
    }
}
addToDatabase().catch(console.dir)


app.listen(port, () => {
    console.log('from listen bro', port)
})