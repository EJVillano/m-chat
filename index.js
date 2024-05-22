// [Dependecies and modules]
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser")

// [Routes Access]
const userRoutes = require('./routes/user.js')
const messageRoutes = require('./routes/message.js')

// [Environment Setup]
const port = 4000;

// [Server Setup]
const app = express();

//[Middlewares]
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(cors());    

//[Database Connection]
mongoose.connect("mongodb+srv://admin:admin1234@wdc028-course-booking.ozpncap.mongodb.net/m-chat?retryWrites=true&w=majority&appName=WDC028-Course-Booking") 
let db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open",()=>console.log("Now connected to MongoDB Atlas!"));
// [Backend Routes]
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

//[Server Gateway Response]
if(require.main === module){

	app.listen(process.env.PORT || port, ()=>{
		console.log(`API is now online on Port ${process.env.PORT || port}`)
	})
}

module.exports = {app, mongoose};