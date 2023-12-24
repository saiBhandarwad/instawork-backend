const express = require('express')
const jwt = require("jsonwebtoken")
const Work = require('../model/Work')
const workRouter = express.Router()
const JWT_SEC = process.env.JWT_SEC

workRouter
    .post('/getWorksByFilter', async (req, res) => {
        try {
            
            if (req.body.data.sortBy) {
                console.log("one");
                if (req.body.data.type) {
                    console.log("two => ",req.body.data.type);
                    const works = await Work.find(req.body.data.filterOBJECT).sort
                        ([[req.body.data.sortBy, req.body.data.type]])
                    res.json({success:true, works })
                    return
                } 
                console.log("three => ",req.body.data.sortBy);               
                const works = await Work.find(req.body.data.filterOBJECT).sort
                    ([[req.body.data.sortBy, 'asc']])
                res.json({success:true, works })
                return
            }
            
            const works = await Work.find(req.body.data.filterOBJECT)
            res.json({ works })
        } catch (error) {
            res.json({ success:false, error: error.message })
        }
    })
    .post('/postJob', async (req, res) => {
        try {
            const { workType, salary, city, duration, startDate, endDate, detail, address, period,postedDate } = req.body.data
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
            res.json({success:true, message:"work posted successfully!" ,response})
        } catch (error) {
            res.json({success:false, message:"work posting failed" })
        }
    })
    .post('/works', async (req, res) => {
        try {
            const works = await Work.find()
            res.json({ success:true, works })
        } catch (error) {
            console.log({ error: error.message });
        }
    })
    .get('/', async () => {

    })

module.exports = workRouter