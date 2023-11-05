const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const morgan = require("morgan");
const dotenv = require("dotenv");

const app = express();

dotenv.config();
const port = process.env.PORT || 5000;

// middlewares
app.use([cors(), express.json(), cookieParser(), morgan("dev")]);

// mongodb uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1fvvkjr.mongodb.net/?retryWrites=true&w=majority`;

// create mongodb client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobsCollection = client.db("JobClick").collection("jobs");

    //(GET) get all jobs if have a query find the query data else find all data
    app.get("/jobs", async (req, res) => {
      try {
        let query = {};
        const queryLength = Object.keys(query).length;

        if (queryLength) {
          query = req.query;
        }

        const result = await jobsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
      }
    });

    //(GET one job by id) (Private Route)
    app.get("/jobs/:id", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await jobsCollection.findOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
      }
    });

    // (GET) get all jobs which is posted by user
    app.get("/my-jobs", async (req, res) => {
      try {
        const result = await jobsCollection.find(req.query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
      }
    });

    // (POST) post a job
    app.post("/add-jobs", async (req, res) => {
      try {
        const result = await jobsCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
      }
    });

    // (PUT) Update a job by id
    app.put("/update-job/:id", async (req, res) => {
      try {
        const query = {_id: new ObjectId(req.params.id)}
        const updateJobs = {
          $set: req.body
        };
        const result = await jobsCollection.updateOne(query, updateJobs, {upsert: true})
        res.send(result)
      } catch (error) {
        res.status(500).send(error.message);
      }
    });

    // (DELETE)
    app.delete("/delete-job/:id", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await jobsCollection.deleteOne(query);
        res.send(result)
      } catch (error) {
        res.status(500).send(error.message);
      }
    });

    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.log(err);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`Server is running on port ${port}. Please Test API....`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
