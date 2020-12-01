const express = require('express')
const router = new express.Router()
const { unitAdd, checkUnit } = require('../models/TimetablesModel')
const auth = require('../middleware/auth')

router.get('/courseAdd', auth, async(req, res) => {
    try {
        checkUnit(req.query.course, req.query.slot, req.query.day, req.query.year, ((result) => {
            switch (result) {
                case false:

            }
        }))
        unitAdd(
            req.query.name,
            req.query.initials,
            req.query.lecturer,
            req.query.room,
            req.query.course,
            req.query.day,
            req.query.year,
            req.query.slot,
        )
        res.status(200).send()
    } catch (e) {
        res.status(400).send()
    }
})






module.exports = router