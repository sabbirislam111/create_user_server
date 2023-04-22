const express = require('express')
var cors = require('cors')
const app = express()
const port = 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://ishlamsabbir:BjM5jdqB3qcMf8De@cluster0.8ntp6ce.mongodb.net/?retryWrites=true&w=majority";
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
    await client.connect();
    const userCollection = client.db("userCreate").collection('user');
    
    app.get('/users', async (req, res) =>{
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
      console.log(users)
    });

    app.get('/users/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.findOne(query);
      console.log(result);
      res.send(result);
    })

    app.put('/users/:id', async (req, res) =>{
       const id = req.params.id;
       const query = {_id: new ObjectId(id)}
       const options = { upsert: true };
       const user = req.body;
       const updateUser = {
         $set:{
            name : user.name,
            email: user.email
         }
       }
       const result = await userCollection.updateOne(query, updateUser, options);
       console.log(result)
       res.send(result)
    })

    app.post('/users', async (req, res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
      
    });

    app.delete('/users/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query);
      console.log(result);
      res.send(result)
    })


    // const result = await userCollection.insertOne(user);
    // console.log(result)
  } finally {
    
  }
}

run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('user create server')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})