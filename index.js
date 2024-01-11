const mongoose = require('mongoose');
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
dotenv.config()
mongoose.connect(process.env.MONGO_CONNECT);
const path = require('path')

const express = require('express');
const app = express(); 

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + 'public/css'));
app.use("/public", express.static("public", { "extensions": ["js"] }));



const userRoute= require('./routes/userRoute')
app.use('/',userRoute)
const adminRoute= require('./routes/adminRoute')
app.use('/admin',adminRoute)



app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
