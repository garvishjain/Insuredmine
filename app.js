const express = require('express');
const mongoose = require('mongoose')
const os = require('os');
const cron = require('node-cron');
const app = express();
const path = require("path");
const http = require('http');
const monitorCPU = require('./monitor');


// Import Mongoose models
const Message = require('./routes/schemas/messageSchema');
const routes = require('./routes/routes')

let PORT = 3000;
const uri = "mongodb+srv://garvishjain1997:Garvishinsuredmine@insuredmine.aiho7ag.mongodb.net/?retryWrites=true&w=majority&appName=Insuredmine";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** MongoDB Connection */
mongoose.connect(uri,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  maxPoolSize: 10 // Limit max connections
})
  .then(()=>console.log('MongoDB Connected'))
  .catch((err)=>console.log("Mongo error",err))

/** Monitor CPU Usage and Restart Server */
monitorCPU(); // start monitoring

const server = http.createServer(app)
app.use((req,res,next)=>{
    res.header('X-XSS-Protection', '1; mode=block')
    res.header("X-powered-by", "Blood, sweat, and tears.");
    res.header('X-Frame-Options', 'deny')
    res.header('X-Content-Type-Options', 'nosniff')
    res.header(
      'Access-Control-Allow-Methods',
      'GET, PUT, POST, DELETE , HEAD , OPTIONS',
    )
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept,Authorization, X-Token',
    )
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
})

app.use(routes)

server.listen(PORT,()=>{
  console.log(`SERVER IS STARTED AT ${PORT} `);
})