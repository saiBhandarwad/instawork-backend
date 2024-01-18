require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sendOTP = require('./controller/otpController')
const auth = require('./middlewares/auth')
const workRouter = require('./routes/workRouter')
const userRouter = require('./routes/userRouter')
const connectToMongo = require('./db')
const emailVerification = require('./controller/emailVerification')
const User = require('./model/User')
const server = express()
const port = process.env.PORT


connectToMongo(process.env.MONGO_URL)
server.use(express.json())
server.use(cors({
    origin: ["http://localhost:5173",
        "https://instawork-job-hunting-site.vercel.app"]
}))

server.use("/work", auth, workRouter)
server.use("/user", userRouter)
server.get("/works", (req, res) => {
    console.log({ req });
    let works = [{ type: "painting" }, { type: "security" }, { type: "data-entry" }]
    res.send(works)
})

const emailCheck = async(req,res,next) => {
    const {email} = req.body.data
    const user = await User.find({ email })
    console.log({user});
    if(user.length !== 0){
        res.send({success:false, message:"email already exist"})
        return
    }else{
        next()
    }
}
const mobileCheck = async(req,res,next) => {
    const {phone} = req.body.data
    const user = await User.find({ phone })
    console.log({user});
    if(user.length === 0){
        res.send({success:false, message:"mobile number is not registered or not verified"})
        return
    }else{
        next()
    }
}
server.post("/sendOTP", mobileCheck, sendOTP)
server.post("/sendMail", emailCheck, emailVerification)

server.listen(port, () => console.log('app listning on port number', port))