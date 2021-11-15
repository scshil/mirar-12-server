const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
require("dotenv").config();
const cors = require("cors");
//
// const port = process.env.PORT || 5000;
const port = 5000;
app.use(cors());
app.use(express.json());
//
app.get("/", (req, res) => {
  res.send("connected");
});
//
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s1mcl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//
async function run() {
  try {
    await client.connect();
    const database = client.db("MiarWatch");
    const watchCollection = database.collection("products");
    const orderedWatch = database.collection("oder");
    const userReview = database.collection("review");
    const usercollection = database.collection("usercollection");
    // post APi
    app.post("/addproduct", async (req, res) => {
      const watch = req.body;
      const result = await watchCollection.insertOne(watch);
      /*  console.log(result);
      console.log(watch); */
      res.json(result);
    });
    // get API for all data
    app.get("/collection", async (req, res) => {
      const pointer = watchCollection.find({});
      const allWatch = await pointer.toArray();
      res.send(allWatch);
    });
    // get single item
    app.get("/productdetails/:id", async (req, res) => {
      const id = req.params.id;
      const selectedItem = { _id: ObjectId(id) };
      const result = await watchCollection.findOne(selectedItem);
      /*    console.log(id); */
      res.send(result);
    });
    // set order collection
    app.post("/allorders", async (req, res) => {
      const order = req.body;
      const result = await orderedWatch.insertOne(order);
      res.json(result);
      // console.log(result);
      // console.log(order);
    });
    // get order collection
    app.get("/myallorders", async (req, res) => {
      const pointer = orderedWatch.find({});
      const myallorders = await pointer.toArray();
      res.send(myallorders);
    });
    // get review from user
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await userReview.insertOne(review);
      res.json(result);
    });
    // showing review
    app.get("/showreview", async (req, res) => {
      const pointer = userReview.find({});
      const allreviews = await pointer.toArray();
      res.send(allreviews);
    });
    // delete order
    app.delete("/myallorders/:id", async (req, res) => {
      const id = req.params.id;
      const deleteitem = { _id: ObjectId(id) };
      const result = await orderedWatch.deleteOne(deleteitem);
      res.send(result);
    });
    // delete products
    app.delete("/allproducts/:id", async (req, res) => {
      const id = req.params.id;
      const deleteitem = { _id: ObjectId(id) };
      const result = await watchCollection.deleteOne(deleteitem);
      res.send(result);
    });
    // user collection
    app.post("/usercollection", async (req, res) => {
      const user = req.body;
      const result = await usercollection.insertOne(user);
      // console.log(result);
      res.json(result);
    });
    // gmail
    app.put("/usercollection", async (req, res) => {
      const user = req.body;
      // console.log("put", user);
      const filter = { email: user.email };
      const option = { upsert: true };
      const update = { $set: user };
      const result = await usercollection.updateOne(filter, update, option);
      res.json(result);
    });
    // make admin
    app.put("/usercollection/admin", async (req, res) => {
      const user = req.body;
      console.log(user);
      const filter = { email: user.email };
      // console.log("put", filter);
      const update = { $set: { role: "admin" } };
      const result = await usercollection.updateOne(filter, update);
      res.json(result);
    });
    // check admin
    app.get("/usercollection/:email", async (req, res) => {
      const admin = req.params.email;
      const pointer = { email: admin };
      const result = await usercollection.findOne(pointer);
      let isAdmin = false;
      if (result?.role === "admin") {
        isAdmin = true;
      }
      res.send({ admin: isAdmin });
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);
//
app.listen(port, () => {
  console.log("connected at ", port);
});
