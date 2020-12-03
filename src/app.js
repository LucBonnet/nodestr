"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config/config");
const path = require("path");

const app = express();
const router = express.Router();

// Conecta ao banco
mongoose.connect(config.connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Carrega os Models
const Product = require("./models/product");
const Customer = require("./models/customer");
const Order = require("./models/order");

// Carregar as Rotas
const indexRoute = require("./routes/index-route");
const productRoute = require("./routes/product-route");

const customerRoute = require("./routes/customer-route");
const orderRoute = require("./routes/order-route");

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  express.json({
    limit: "5mb",
  })
);
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(
  "/product",
  express.static(path.join(__dirname, "..", "uploads", "products"))
);
app.use("/", indexRoute);
app.use("/products", productRoute);
app.use("/customers", customerRoute);
app.use("/orders", orderRoute);

module.exports = app;
