const express = require('express')
const router = new express.Router()
const Connection = require('../db/mysql')
const auth = require('../middleware/auth')
const { addFaq, getFaqs, deleteFaq } = require('../models/FaqModel')

router.post('/addFaq', auth, async(req, res) => {
    try {
        addFaq(req.user.id, req.query.title, req.query.message)
        res.status(200).send()
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/getFaq', auth, async(req, res) => {
    try {
        getFaqs((results) => {
            res.status(200).send(results)
        })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/deleteFaq', auth, async(req, res) => {
    try {
        if (req.query.id == null) {
            return res.status(400).send();
        } else {
            deleteFaq(req.query.id)
            res.status(200).send()
        }
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/deleteFaqs', auth, async(req, res) => {
    try {
        deleteFaqs()
        res.status(200).send()
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router