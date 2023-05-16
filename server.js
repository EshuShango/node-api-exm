"use strict";
const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/productModel");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//routes

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/blog", (req, res) => res.send("Hello Blog!"));

app.get("/products", async(req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json( products );
    
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

app.get("/products/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json( product );
    
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

app.post("/product", async(req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json( product );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message })
  }
 
})

//update a product
app.put("/products/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    //we cant find the product
    if (!product) {
       return res.status(404).json({ message: `can't find product by ${id}` });
    }
    const updated = await Product.findById(id);
    res.status(200).json( updated );
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

//delete a product
app.delete("/products/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    //we cant find the product
    if (!product) {
      return res.status(404).json({ message: `can't find product by ${id}` });
   }
   res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

//mongoDB connection
mongoose
  .connect(
    "mongodb+srv://tma:testing123@q.to1hiyy.mongodb.net/Node-API?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  })
  .catch((err) => console.log(err));
