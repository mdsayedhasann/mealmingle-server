const express = require('express')
const cors = require('cors')
const app = express()
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
let db
app.get('foods', async(req, res) => {
    const foodCollection = db.collection('foods')
    const cursor = foodCollection.find()
    const result = await cursor.toArray()
    res.json(result)
})

app.post('foods', async (req, res) => {
    const foods = req.body;
    console.log(foods);
})


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        db  = client.db('MEALMINGLE')
        
        
        // Send a ping to confirm a successful connection
        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }catch (error) {
        console.error('Database error' , error);
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);


app.listen(port, () => {
    console.log(`MealMingle Server is running on port ${port}`);
})