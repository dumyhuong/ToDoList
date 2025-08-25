const express = require('express')  
const mongoose = require('mongoose')
const routes = require('./routes/ToDoRoute.js') 
const cors = require ("cors")

require('dotenv').config()
const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Todo API is running...");
});
app.use(routes);

mongoose
.connect(process.env.MONGODB_URL)
.then(()=>console.log('Connected To MongoDB...'))
.catch( (err)=> console.log(err))
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Listening on: ${PORT}`);
});

