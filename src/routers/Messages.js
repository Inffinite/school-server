const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const moment = require('moment')
const {
    addSuggestion,
    addMessage,
    getMessages,
    deleteMessage,
    deleteUserMessage
} = require('../models/MessagesModel')

router.post('/suggest', auth, async(req, res) => {
    try {
        await addSuggestion(req.user.id, req.query.title, req.query.message)
        res.status(200).send()
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
})

router.post('/message', auth, async(req, res) => {
    try {
        await addMessage(req.user.id, req.query.title, req.query.message, req.query.type)
        res.status(200).send()
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
})

router.delete('/deleteMessage', auth, async(req, res) => {
    try {
        await deleteMessage(req.query.id)
        res.status(200).send()
    } catch (error) {
        res.status(400).send()
    }
})

// delete all messages from a specific user
router.delete('/deleteUserMessage', auth, async(req, res) => {
    try {
        await deleteUserMessage(req.query.id)
        res.status(200).send()
    } catch (error) {
        res.status(400).send()
    }
})

router.get('/getMessages', auth, async(req, res) => {

    // if an id is provided fetch the messages it owns
    try {
        if (req.query.id) {
            await getMessages(req.query.id, ((results) => {
                if (results == false) {
                    return res.status(400).send()
                } else {
                    for (i = 0; i < results.length; i++) {
                        results[i].created_at = moment(results[i].created_at, "YYYYMMDD").fromNow()
                    }
                    return res.status(200).send(results)
                }
            }))
        } else {
            await getMessages(null, ((results) => {
                if (results == false) {
                    return res.status(400).send()
                } else {
                    for (i = 0; i < results.length; i++) {
                        results[i].created_at = moment(results[i].created_at, "YYYYMMDD").fromNow()
                    }

                    return res.status(200).send(results)
                }
            }))
        }
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
})

module.exports = router