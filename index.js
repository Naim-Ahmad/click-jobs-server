const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion } = require("mongodb");
const morgan = require("morgan");
const dotenv = require("dotenv");

const app = express()

dotenv.config();
const port = process.env.PORT || 5000;

// middlewares
app.use([cors(), express.json(), cookieParser()])

// mongodb uri
const uri = "mongodb+srv://naimahmad201103:Y7VRXCC5XzDS7Nix@cluster0.1fvvkjr.mongodb.net/?retryWrites=true&w=majority";

// create mongodb client
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

    


    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }catch(err){
    console.log(err);
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send(`Server is running on port ${port}. Please Test API....`)
})


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})

