const express = require('express')
const jwt = require("jsonwebtoken")
const Work = require('../model/Work')
const SavedJobs = require('../model/SavedWorks')
const User = require("../model/User")
const workRouter = express.Router()
const JWT_SEC = process.env.JWT_SEC

workRouter
    .post("/getAllCityAndWorks", async (req, res) => {
        try {
            let works = await Work.find()
            let cityArray = works.map((item) => item.city)
                .filter((item, index, arr) => arr.indexOf(item) === index)
            let workTypeArray = works.map((item) => item.type)
                .filter((item, index, arr) => arr.indexOf(item) === index)
            res.json({ success: true, cityArray, workTypeArray })
        } catch (error) {
            res.json({ success: false, message: error.message })
        }
    })
    .post('/getWorksByFilter', async (req, res) => {
        try {
            if (req.body.data.sortBy) {
                if (req.body.data.type) {
                    if (req.body.data.pathname === "/myjobs") {
                        /* my jobs */
                        const myJobs = await Work.find({ ...req.body.data.filterOBJECT, user: req.body.data.email }).sort([[req.body.data.sortBy, req.body.data.type]])

                        /* saved jobs */
                        const savedJobs = await SavedJobs.find({...req.body.data.filterOBJECT, email: req.body.data.email }).sort([[req.body.data.sortBy, req.body.data.type]])

                        /* works */
                        const works = await Work.find(req.body.data.filterOBJECT).sort([[req.body.data.sortBy, req.body.data.type]])
                        res.json({ success: true, works, savedJobs, myJobs })
                        return
                    }
                    const works = await Work.find(req.body.data.filterOBJECT).sort
                        ([[req.body.data.sortBy, req.body.data.type]])
                    res.json({ success: true, works })
                    return
                }
                //console.log("three => ", req.body.data.sortBy);
                const works = await Work.find(req.body.data.filterOBJECT).sort
                    ([[req.body.data.sortBy, 'asc']])
                res.json({ success: true, works })
                return
            }

            const works = await Work.find(req.body.data.filterOBJECT)
            res.json({ success: true, works })
        } catch (error) {
            res.json({ success: false, error: error.message })
        }
    })
    .post('/postJob', async (req, res) => {
        try {
            const { workType, salary, city, duration, startDate, endDate, detail, address, salaryPeriod, postedDate } = req.body.data
            const { token } = req.body.headers
            const { email } = jwt.verify(token, JWT_SEC)
            const user = await User.findOne({email}).select("-password")

            const response = await Work.create({
                type: workType.charAt(0).toUpperCase() + workType.slice(1),
                detail,
                address,
                city: city.charAt(0).toUpperCase() + city.slice(1),
                duration,
                startDate,
                endDate,
                salary: salary,
                salaryPeriod,
                user: user,
                owner:email,
                postedDate
            })
            res.json({ success: true, message: "work posted successfully!", response })
        } catch (error) {
            res.json({ success: false, message: "work posting failed", error:error.message })
        }
    })
    .post('/works', async (req, res) => {
        try {
            console.log("works");
            const works = await Work.find().sort([["postedDate", "desc"]])
            res.json({ success: true, works })
        } catch (error) {
            //console.log({ error: error.message });
        }
    })
    .post('/checkSavedJob', (req, res) => {
        try {
            const { token } = req.body.headers
            const { email } = jwt.verify(token, JWT_SEC)
            const response = SavedJobs.findOne({ _id: req.body.data.work._id, email })
            res.json({ success: true, message: "job saved successfully!", response })
        } catch (error) {
            res.json({ success: false, message: error.message, response })
        }
    })
    .post('/saveJob', (req, res) => {
        try {
            const { token } = req.body.headers
            const { email } = jwt.verify(token, JWT_SEC)
            let id = req.body.data.work._id
            let work = req.body.data.work
            delete work._id
            //console.log({ work, id });
            SavedJobs.create({ ...work, id, saver:email })
            res.json({ success: true, message: "job saved successfully!" })
        } catch (error) {
            res.json({ success: false, message: error.message })
        }
    })
    .post('/getSavedJobs', async (req, res) => {
        try {
            const savedJobs = await SavedJobs.find({ saver: req.body.data.email }).sort([["postedDate", "desc"]])
            console.log({ savedJobs })
            res.json({ success: true, savedJobs })

        } catch (error) {
            res.json({ success: false, message: error.message })
        }
    }) 
    .post('/getMyJobs', async (req, res) => {
        try {
            const myJobs = await Work.find({ owner: req.body.data.email }).sort([["postedDate", "desc"]])
            res.json({ success: true, myJobs })

        } catch (error) {
            res.json({ success: false, message: error.message })
        }
    })
    .post('/removeFromSavedJob', async(req, res) =>{
        try {
            const {email} = jwt.verify(req.body.data.token,JWT_SEC)
            console.log({email, id:req.body.data.work._id});
            const response = await SavedJobs.deleteOne({ id: req.body.data.work.id,saver:email })
            res.json({ success: true, response })
        } catch (error) {
            res.json({ success: false, message:error.message })
        }
    })
    .post('/deleteWork', async(req, res) =>{
        try {
            const myJobs = await Work.deleteOne({ _id: req.body.data.work._id })
            res.json({ success: true, myJobs })
        } catch (error) {
            res.json({ success: false, message:error.message })
        }
    })
    .patch('/updateWork', async(req, res) =>{
        try {
            const { workType, salary, city, duration, startDate, endDate, detail, address, period, salaryPeriod, _id } = req.body.data
            //console.log({workType, salary, city, duration, startDate, endDate, detail, address, period, _id});
            const response = await Work.findByIdAndUpdate(_id,{ 
                type: workType.charAt(0).toUpperCase() + workType.slice(1), salary, city: city.charAt(0).toUpperCase()+ city.slice(1), duration, startDate, endDate, detail, address, period, salaryPeriod, _id
            })
            
            res.json({ success: true, message: "work updated successfully!", response })
        } catch (error) {
            res.json({ success: false, message: "work updation failed", error:error.message })
        }
    })
module.exports = workRouter