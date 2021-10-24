const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
require('dotenv').config()

const port = 5000;

//middleware
app.use(cors())
app.use(express.json())

// mydatabase2
//pass: 1MEf27WhMZMdg2Sc


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSS}@cluster0.3zhcn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try
    {
        await client.connect()
        // console.log('connect with database')
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
       //get all data api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
       })

       //get single id
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            console.log('single id', id);
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.send(service)
       })
        //post api
        app.post('/services', async (req, res) => {
            
            const service = req.body;
            console.log('hitted from ui', service);
        const result = await servicesCollection.insertOne(service)
            res.json(result)
        
        })

        //delete 
        app.delete('/serivces/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query)
            res.json(result)
        })



    }
    catch {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('this is server of genius car');
})

app.listen(port, () => {
    console.log('genius car port', port);
})