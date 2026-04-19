const express = require('express');
const app = express();

const userRoute = require('./Routes/userroutes');

app.use('/user' ,userRoute);