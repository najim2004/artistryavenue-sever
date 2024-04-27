// ----------------import--------------------

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// ----------------import--------------------

// ---------------------middleware--------------------
app.use(cors());
app.use(express.json());
// ---------------------middleware--------------------

app.get("/", (req, res) => {
  res.send("Craft and Painting server is running");
});

// --------------------mongodb--------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d0cidbu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const database = client.db("Art_and_craft_DB");
    const craftCollection = database.collection("All_Art_and_craft");
    const reviewCollection = database.collection("Review");

    // get all review data from the database
    app.get("/review", async (req, res) => {
      const all_art_and_craft = await reviewCollection.find().toArray();
      res.send(all_art_and_craft);
    });
    // get all craft data from the database
    app.get("/all_art_and_craft", async (req, res) => {
      const all_art_and_craft = await craftCollection.find().toArray();
      res.send(all_art_and_craft);
    });

    // get single craft data from the database
    app.get("/all_art_and_craft/:id", async (req, res) => {
      const id = req.params.id;
      const single_art_and_craft = await craftCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(single_art_and_craft);
    });

    // delete single craft data from the database
    app.delete("/all_art_and_craft/:id", async (req, res) => {
      const id = req.params.id;
      const result = await craftCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // post craft data to the database
    app.post("/all_art_and_craft", async (req, res) => {
      const new_art_and_craft = req.body;
      const result = await craftCollection.insertOne(new_art_and_craft);
      res.send(result);
    });

    // put a new item in the database
    app.put("/all_art_and_craft/:id", async (req, res) => {
      const id = req.params.id;
      const item = req.body;
      const updatedItem = {
        $set: {
          user_name: item?.user_name,
          user_email: item?.user_email,
          item_name: item?.item_name,
          subcategory_Name: item?.subcategory_Name,
          description: item?.description,
          image: item?.image,
          processing_time: item?.processing_time,
          Price: item?.Price,
          rating: item?.rating,
          customization: item?.customization,
          stockStatus: item?.stockStatus,
        },
      };
      const result = await craftCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        updatedItem
      );
      res.send(result);
    });

    // find all post by email address
    app.get("/my_art_&_craft_list/:email", async (req, res) => {
      const email = req.params.email;
      const result = await craftCollection
        .find({ user_email: email })
        .toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// --------------------mongodb--------------------

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
