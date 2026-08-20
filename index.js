const connectDB = require('./src/database/connectDB')
const dotenv = require('dotenv')
const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser')
const authRouter = require('./src/Routers/AuthRouter')
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})