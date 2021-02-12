const express = require('express')
const router = new express.Router()
const {
    fetchUserDetails
} = require('../models/UserModel')
const auth = require('../middleware/auth')

const { stalker } = require('../models/StalkersModel')

router.post('/addStalker', auth, async (req, res) => {
    try {
        if(req.query.victimId == req.user.id){
            return res.status(200).send()
        }

        var url = req.user.fname + ' ' + req.user.lname

        await stalker(req.user.id, req.query.victimId, req.user.fname, url)
        res.status(200).send()
    } catch(e){
        console.log(e)
        res.status(400).send()
    }
})

router.get('/stalkers', auth, async (req, res) => {
    try {
        stalkers(req.user.id, ((results) => {
            res.status(200).send(results)
        }))
    } catch (error) {
        req.status(400).send()
    }
})

router.get('/stalkUser', auth, async (req, res) => {
    try {
        fetchUserDetails(req.query.id, ((results) => {

            // if victim id matches the stalker's id
            // send back the details
            // but dont add him to the stalkers list

            var name = req.user.fname + ' ' + req.user.lname

            if(req.user.id == req.query.id){
                stalker(req.user.id, results.id, name, (() => {
                    res.status(200).send(results)
                }))
                // return res.status(200).send(results); 
            } else {
                stalker(req.user.id, results.id, (() => {
                    res.status(200).send(results)
                }))
            }
        }))

    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
})

module.exports = router