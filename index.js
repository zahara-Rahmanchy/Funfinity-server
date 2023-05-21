const express = require("express");
const cors = require("cors");

require("dotenv").config();
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ofsmeh8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    // client.connect();
    const gamesCollection = client.db("funfinityDB").collection("games");

    //------------------------ to get the data from the db ---------------------------------------------

    app.get("/toys", async (req, res) => {
      const type = req.query.type === "ascen";
      const value = req.query.value;
      console.log("q", req.query.value, req.query.type);
      const sortOb = {};
      sortOb[value] = type ? 1 : -1;

      const cursor = await gamesCollection.find({}).sort(sortOb).toArray();
      // const result = await cursor;
      res.send(cursor);
    });

    // ------------------------------------------get data catagory wise---------------------------------------
    app.get("/toys/:category", async (req, res) => {
      const cate = req.params.category;
      // console.log("cata", cate);
      const query = {subCategory: cate};
      const options = {
        projection: {Name: 1, Price: 1, Rating: 1, picture: 1},
      };
      const result = await gamesCollection.find(query, options).toArray();
      // console.log("result:", result);
      res.send(result);
    });
    // ------------------------------------------view details id wise-------------------------------------------------------

    app.get("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await gamesCollection.findOne(query);

      res.send(result);
    });
    // -----------------get a single user toys---------------------------
    app.get("/mytoys", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = {sellerEmail: req.query.email};
      }
      const result = await gamesCollection.find(query).toArray();
      res.send(result);
    });

    // ----------------------------post for adding toy to the db--------------------------------------------

    app.post("/toys", async (req, res) => {
      const toy = await gamesCollection.insertOne(req.body);
      res.send(toy);
    });

    // -------------------delete-----------------
    app.delete("/deletetoys/:id", async (req, res) => {
      const id = req.params.id;
      const que = {_id: new ObjectId(id)};

      const result = await gamesCollection.deleteOne(que);
      res.send();
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ping: 1});
    console.log(
      "Pinged your funfinity. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Funfinity is running");
});

app.listen(port, () => {
  console.log(`Funfinity crud  is  running on ',${port}`);
});
