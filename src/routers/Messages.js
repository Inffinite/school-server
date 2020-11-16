const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const { 
    addSuggestion, 
    getSuggestions, 
    deleteSuggestion,
    deleteUserSuggestions,
    deleteAnnouncement,
    addAnnouncement,
    getAnnouncements,
    deleteUserAnnouncements
} = require('../models/MessagesModel')

router.post('/suggest', auth, async (req, res) => {
    try {
        await addSuggestion(req.user.id, req.query.title, req.query.message)
        res.status(200).send()
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
})

router.post('/announce', auth, async (req, res) => {
    try {
        await addAnnouncement(req.user.id, req.query.title, req.query.message)
        res.status(200).send()
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
})

// delete a suggestion by its id
router.delete('/deleteSuggestion', auth, async (req, res) => {
    try {
        await deleteSuggestion(req.query.id)
        res.status(200).send()
    } catch (error) {
        res.status(400).send()
    }
})

router.delete('/deleteAnnouncement', auth, async (req, res) => {
    try {
        await deleteAnnouncement(req.query.id)
        res.status(200).send()
    } catch (error) {
        res.status(400).send()
    }
})

// delete all suggestions from a specific user
router.delete('/deleteUserSuggestions', auth, async (req, res) => {
    try {
        await deleteUserSuggestions(req.query.id)
        res.status(200).send()
    } catch (error) {
        res.status(400).send()
    }
})

router.delete('/deleteUserAnnouncements', auth, async (req, res) => {
    try {
        await deleteUserAnnouncements(req.query.id)
        res.status(200).send()
    } catch (error) {
        res.status(400).send()
    }
})

router.get('/getSuggestions', auth, async (req, res) => {
    try {
        if(req.query.id) {
            await getSuggestions(req.query.id, ((results) => {
                if (results == false){
                    return res.status(400).send()
                } else {
                    return res.status(200).send(results)
                }
            }))
        } else{
            await getSuggestions(null, ((results) => {
                if (results == false){
                    return res.status(400).send()
                } else {
                    return res.status(200).send(results)
                }
            }))
        }
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
})

router.get('/getAnnouncements', auth, async (req, res) => {
    try {
        if(req.query.id) {
            await getAnnouncements(req.query.id, ((results) => {
                if (results == false){
                    return res.status(400).send()
                } else {
                    return res.status(200).send(results)
                }
            }))
        } else{
            await getAnnouncements(null, ((results) => {
                if (results == false){
                    return res.status(400).send()
                } else {
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