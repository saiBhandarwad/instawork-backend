require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sendOTP = require('./controller/otpController')
const auth = require('./middlewares/auth')
const workRouter = require('./routes/workRouter')
const userRouter = require('./routes/userRouter')
const connectToMongo = require('./db')
const emailVerification = require('./controller/emailVerification')
const server = express()
const port = process.env.PORT


connectToMongo(process.env.MONGO_URL)
server.use(express.json())
server.use(cors({
    origin:["http://localhost:5173",
    "https://instawork-frontend.vercel.app"]
}))

server.use("/work",auth,workRouter)
server.use("/user",userRouter)
server.post("/sendOTP",sendOTP)
server.post("/sendMail",emailVerification)

server.listen(port,()=>console.log('app listning on port number',port))