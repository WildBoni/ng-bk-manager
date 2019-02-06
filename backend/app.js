const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

const app = express();

mongoose.connect(
  "mongodb+srv://boni:" +
  process.env.MONGO_ATLAS_PW +
  "@cluster0-u12zj.mongodb.net/node-angular?retryWrites=true"
)
  .then(() => {
    console.log('connected');
  })
  .catch(() => {
    console.log('connection failed');
  });

app.use(bodyParser.json());

// // Create link to Angular build directory
// var distDir = __dirname + "/dist/";
// app.use(express.static(distDir));

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
})

app.use("/api/books", booksRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
