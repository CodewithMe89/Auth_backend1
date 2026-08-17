const connectDB = require('./database/connectDB')
const dotenv = require('dotenv')
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const authRouter = require('./Routers/AuthRouter')
const cors = require('cors');

dotenv.config()
connectDB()

app.use(cors({
    origin:"*",
    credentials:true
}))

app.use(cookieParser())
app.use(express.json());
app.use('/', authRouter);

module.exports = app;