const express = require("express")
require('dotenv').config();
const mongoose = require("mongoose");
const cors = require('cors')

const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
  console.log("BDD connected")
})
.catch(() => {
  console.log("Error connection")
})

app.listen(3000, () =>{
    console.log("Serer is running on port 3000")
})