const express = require("express");
const cors = require("cors");

require("dotenv").config();
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Funfinity is running");
});

app.listen(port, () => {
  console.log(`Funfinity crud  is  running on ',${port}`);
});
