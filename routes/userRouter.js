const User = require('../model/User.js')
const express = require('express')
const userRouter = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const JWT_SEC = process.env.JWT_SEC

userRouter
    .get("/", async (req, res) => {
        try {
            const users = await User.find()
            res.json({ users })
        } catch (error) {
            res.json({ message: "error occured while getting users", error: error.message })
        }
    })
    .get("/:id", async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            res.json({ user })

        } catch (error) {
            res.json({ message: "error occured while getting user", error: error.message })
        }
    })
    .post("/validateUser", async (req, res) => {
        try {
            const token = req.body.data.token
            const { email } = jwt.verify(token, JWT_SEC)
            const user = await User.findOne({email})
            if(user){
                res.json({success:true})
            }
        } catch (error) {
            res.json({success:false})
        }
    })
    .post("/getUser", async (req, res) => {
        try {
            const email = req.body.data.email
            if (email) {
                const user = await User.findOne({ email })
                res.json({ user })
            } else {
                res.json({ error: "provide email" })
            }
        } catch (error) {
            res.json({ error: error.message })
        }

    })
    .post("/login", async (req, res) => {
        let user;
        try {
            const users = await User.find()
            let authTokenFromHeader;
            for (let key in req.body.headers) {
                if (key === 'Authorization') {
                    authTokenFromHeader = req.body.headers[key]
                }
            }
            console.log({ authTokenFromHeader });
            if (authTokenFromHeader) {
                try {
                    const { email } = jwt.verify(authTokenFromHeader, JWT_SEC)
                    res.json({ email, success: true, with: "jwt token" })
                } catch (error) {
                    res.json({ error: error.message })
                }
                return;
            }
            user = users.find(item => item.email === req.body.data.email)
            const isPasswordMatched = bcrypt.compareSync(req.body.data.password, user?.password)
            if (isPasswordMatched) {
                const { email } = user
                const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12), email }, JWT_SEC)
                res.json({ success: true, token })
            } else {
                res.json({ success: false, with: "traditional login" })
            }

        } catch (error) {
            res.json({ user, message: "error occured while getting user", error: error.message })
        }
    })
    .post("/loginWithOTP", async (req, res) => {
        try {
            const { phone } = req.body.data
            // console.log({ phone });
            const user = await User.findOne({ phone }).select("-password")
            // console.log({ user });
            const { email } = user
            const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12), email }, JWT_SEC)
            if (user) {
                res.json({ user, token })
            }
        } catch (error) {
            res.json({ error: error.message })
        }
    })
    .post("/signup", async (req, res) => {
        try {
            const { firstName, lastName, email, phone, password } = req.body.data
            const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12), email }, JWT_SEC)
            // console.log(req.body.data);
            const hashedPassword = await bcrypt.hash(password, 10)

            await User.create({
                firstName, lastName, email, phone, password: hashedPassword
            })

            res.status(201).json({ message: "user created successfully!!", token })
        } catch (error) {
            res.json({ message: "a error occured while creating user!!", error: error.message })
        }
    })
    .put("/", async () => {

    })
    .delete("/:id", async (req, res) => {
        try {
            const response = await User.findByIdAndDelete(req.params.id)
            if (response === null) { res.send("user does not exist") }
            else { res.json({ message: "user deleted successfully!!", response }) }
        } catch (error) {
            res.json({ message: "error occured while deleting user", error: error.message });
        }

    })

module.exports = userRouter