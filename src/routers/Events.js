const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const { newEvent } = require('../models/EventsModel')

router.get('/newEvent', auth, async (req, res) => {
    try {
        newEvent(req.user.id, req.query.date, req.query.title, req.query.message)
        res.status(200).send()
    } catch (error) {
        res.status(400).send()
    }
})

module.exports = router