const connectDB = require('./src/database/connectDB')
const dotenv = require('dotenv')
const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser')
const authRouter = require('./src/Routers/AuthRouter')

const cors = require('cors');
const allowedOrigins = [
    "https://bala-ji-cloth-store.vercel.app",
    "https://balajiclothstore-q2u2--5173--017acfb7.local-credentialless.webcontainer.io/"
]
dotenv.config()
const starterServer = async () => {
    await connectDB();

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

starterServer();

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        if (/\.webcontainer\.io$/.test(new URL(origin).hostname)) {
            return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}))

app.use(cookieParser())
app.use(express.json());
app.use('/', authRouter);

