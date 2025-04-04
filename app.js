const express = require('express');
const mongoose = require('mongoose')
const os = require('os');
const cron = require('node-cron');
const app = express();
const path = require("path");
const http = require('http');


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
setInterval(() => {
  const cpuUsage = os.loadavg()[0];
  console.log(cpuUsage,"<<<cpuUsage>>>");
  
  if (cpuUsage > 0.7) {
    console.log('CPU usage high, restarting...');
    process.exit(1);
  }
}, 5000);


/** Scheduled Post Service */
app.post('/schedule-message', async (req, res) => {
  const { message, day, time } = req.body;

  if (!message || !day || !time) {
    return res.status(400).json({ error: 'message, day, and time are required.' });
  }

  const insertAt = await getNextDate(day, time);
  await (message, insertAt);

  res.json({ status: 'Message scheduled', insertAt });

  // const { message, day, time } = req.body;

  // const scheduleDate = new Date(`${day}T${time}`);
  // console.log(scheduleDate,"<<scheduleDate>>");
  
  // if (isNaN(scheduleDate)) {
  //   return res.status(400).json({ error: 'Invalid day/time format' });
  // }

  // const newMessage = await Message.insertOne({ message, scheduleTime: scheduleDate });
  // console.log(newMessage,"<<<newMessage>>>");
  
  // await newMessage.save();

  // res.status(201).json({ message: 'Message scheduled successfully' });
});


// Helper to convert day + time to Date
const getNextDate= async(day, time)=> {
  const daysMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const [hours, minutes] = time.split(':').map(Number);
  const today = new Date();
  const currentDay = today.getDay();
  const targetDay = daysMap[day.toLowerCase()];

  const daysToAdd = (targetDay - currentDay + 7) % 7 || 7;
  const targetDate = new Date(today);
  console.log(targetDate,"<<<targetDate>>>");
  targetDate.setDate(today.getDate() );
  targetDate.setHours(hours);
  console.log(targetDate,"<<<targetDate1>>>");
  targetDate.setMinutes(minutes);
  console.log(targetDate,"<<<targetDate2>>>");
  targetDate.setSeconds(0);
  targetDate.setMilliseconds(0);
  console.log(targetDate,"<<<targetDate3>>>");

  return targetDate;
}

// Schedule a message to be inserted
// const scheduleInsert= async(message, date)=> {
//   const cronTime = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
// console.log(cronTime,"cronTime");

//   cron.schedule(cronTime, async () => {
//     console.log("gdsdfsd",{ message, insertAt: date });
    
//     await Message.insertOne({ message, insertAt: date });
//     console.log(`Message inserted at scheduled time: ${message}`);
//   }, {
//     scheduled: true,
//     timezone: "UTC" // Change to your timezone if needed
//   });

//   console.log(`Scheduled: ${message} at ${date.toISOString()}`);
// }

cron.schedule('* * * * *', async () => {
  const now = new Date();
  const nextMinute = new Date(now.getTime() + 60000);

  const dueMessages = await Message.find({
    insertAt: { $gte: now, $lt: nextMinute }
  });

  dueMessages.forEach(msg => {
    console.log('💬 Message inserted:', msg.message);
    // You can trigger more logic here (e.g., notify, send, etc.)
  });
});


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