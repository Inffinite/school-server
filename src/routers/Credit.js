const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const moment = require('moment')
const { getCredits, addCredit, deleteCredit } = require('../models/CreditModel')

router.post('/addCredit', auth, async(req, res) => {
    try {
        const name = req.user.fname + ' ' + req.user.lname
        await addCredit(req.user.id, name, req.query.message)
        res.status(200).send()
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
})

router.get('/getCredits', auth, async(req, res) => {
    try {
        await getCredits((result) => {
            res.status(200).send(result)
        })

    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
})

router.post('/deleteCredits', auth, async(req, res) => {
    try {
        await deleteCredit(req.query.id)
        res.status(200).send()
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
})


module.exports = router