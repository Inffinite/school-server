const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const { newEvent, getEvents, deleteEvent } = require('../models/EventsModel')

router.post('/newEvent', auth, async(req, res) => {
    try {
        newEvent(req.user.id, req.query.date, req.query.title, req.query.message)
        res.status(200).send()
    } catch (error) {
        res.status(400).send()
    }
})

router.get('/getEvents', auth, async(req, res) => {
    try {
        await getEvents((result) => {
            res.status(200).send(result)
        })
    } catch {
        res.status(400).send()
    }
})

// delete a single event
router.delete('/deleteEvent', auth, async(req, res) => {
    try {
        deleteEvent(req.query.id)
        res.status(200).send()
    } catch {
        res.status(400).send()
    }
})

// delete all events
router.delete('/deleteEvents', auth, async(req, res) => {
    try {
        deleteEvents()
        res.status(200).send()
    } catch {
        res.status(400).send()
    }
})

module.exports = router