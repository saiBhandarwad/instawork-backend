const express = require('express')
const jwt = require("jsonwebtoken")
const Work = require('../model/Work')
const SavedJobs = require('../model/SavedWorks')
const workRouter = express.Router()
const JWT_SEC = process.env.JWT_SEC

workRouter
    .post("/getAllCityAndWorks", async (req, res) => {
        try {
            console.log("hi i am in getallcityandworks");
            let works = await Work.find()
            let cityArray = works.map((item) => item.city)
                .filter((item, index, arr) => arr.indexOf(item) === index)
            let workTypeArray = works.map((item) => item.type)
                .filter((item, index, arr) => arr.indexOf(item) === index)
            res.json({ success: true, cityArray, workTypeArray })
        } catch (error) {
            res.json({ success: false, message:error.message })
        }
    })
    .post('/getWorksByFilter', async (req, res) => {
        try {
            console.log(req.body.data);
            if (req.body.data.sortBy) {
                console.log("one");
                if (req.body.data.type) {
                    console.log("two => ", req.body.data.type);
                    const works = await Work.find(req.body.data.filterOBJECT).sort
                        ([[req.body.data.sortBy, req.body.data.type]])
                    res.json({ success: true, works })
                    return
                }
                console.log("three => ", req.body.data.sortBy);
                const works = await Work.find(req.body.data.filterOBJECT).sort
                    ([[req.body.data.sortBy, 'asc']])
                res.json({ success: true, works })
                return
            }

            const works = await Work.find(req.body.data.filterOBJECT)
            res.json({success: true, works })
        } catch (error) {
            res.json({ success: false, error: error.message })
        }
    })
    .post('/postJob', async (req, res) => {
        try {
            const { workType, salary, city, duration, startDate, endDate, detail, address, period, postedDate } = req.body.data
            const { token } = req.body.headers
            const { email } = jwt.verify(token, JWT_SEC)

            const response = await Work.create({
                type: workType,
                detail,
                address,
                city: city,
                duration,
                startDate,
                endDate,
                salary: salary,
                salaryPeriod: period,
                user: email,
                postedDate
            })
            res.json({ success: true, message: "work posted successfully!", response })
        } catch (error) {
            res.json({ success: false, message: "work posting failed" })
        }
    })
    .post('/works', async (req, res) => {
        try {
            const works = await Work.find().sort([["postedDate","desc"]])
            res.json({ success: true, works })
        } catch (error) {
            console.log({ error: error.message });
        }
    })
    .post('/checkSavedJob', (req,res)=>{
        try {
            const { token } = req.body.headers
            const { email } = jwt.verify(token, JWT_SEC)
            const response = SavedJobs.findOne({_id:req.body.data.work._id,email})
            res.json({success:true, message:"job saved successfully!", response})
        } catch (error) {
            res.json({success:false, message:error.message , response})
        }
    })
    .post('/saveJob', (req,res)=>{
        try {
            const { token } = req.body.headers
            const { email } = jwt.verify(token, JWT_SEC)
            let id = req.body.data.work._id
            let work = req.body.data.work
            delete work._id
            console.log({work,id});
            SavedJobs.create({...work,id ,email})
            res.json({success:true, message:"job saved successfully!"})
        } catch (error) {
            res.json({success:false, message:error.message})
        }
    })
    .post('/getSavedJobs', async (req,res) => {
        try {
            const savedJobs = await SavedJobs.find({email:req.body.data.email})
            console.log({savedJobs})
            res.json({success : true, savedJobs})
            
        } catch (error) {
            res.json({success:false, message:error.message})
        }
    })
    .post('/getMyJobs', async (req,res) => {
        try {
            const myJobs = await Work.find({user:req.body.data.email})
            res.json({success : true, myJobs})

        } catch (error) {
            res.json({success:false, message:error.message})
        }
    })

module.exports = workRouter