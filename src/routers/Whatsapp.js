const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const { addGroup, deleteGroup, getGroups } = require('../models/WhatsappModel')

router.post('/addGroup', auth, async(req, res) => {
    try {
        addGroup(req.user.id, req.query.name, req.query.description, req.query.link)
        res.status(200).send()
    } catch (error) {
        res.status(400).send()
    }
})

router.delete('/deleteGroup', auth, async(req, res) => {
    try {
        deleteGroup(req.query.id)
        res.status(200).send()
    } catch (error) {
        res.status(400).send()
    }
})

router.get('/getGroups', auth, async(req, res) => {
    try {
        getGroups((results) => {
            res.status(200).send(results)
        })
    } catch (error) {
        res.status(400).send()
    }
})


module.exports = router