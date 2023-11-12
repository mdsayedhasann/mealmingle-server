const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');


// Middleware 
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v7q4eit.mongodb.net/?retryWrites=true&w=majority`;
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

app.get('/', (req, res) => {    
    res.send('MealMingle Server is running')
})

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const foodCollection = client.db('MEALMINGLE').collection('foods')

        // Get Foods from Database to Server Start
        app.get('/foods', async(req, res) => {
            const cursor = foodCollection.find()
            const result = await cursor.toArray()
            res.json(result)
        })
        // Get Foods from Database to Server End

        // Post Foods to Database Start
        app.post('/foods', async (req, res) => {
            const foods = req.body;
            const result = await foodCollection.insertOne(foods)
            res.send(result)
            console.log(foods);
        })
        // Post Foods to Database End
    

        
        // Send a ping to confirm a successful connection
        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);


app.listen(port, () => {
    console.log(`MealMingle Server is running on port ${port}`);
})