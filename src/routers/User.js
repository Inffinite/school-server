const express = require('express')
const router = new express.Router()
const Connection = require('../db/mysql')
const axios = require('axios')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const { createUser, confirmToken, generateAuthToken, fetchUserDetails, stalker, addContacts } = require('../models/UserModel')

router.get('/hello', async (req, res) => {
  // var email = 'louislaizr4@gmail.com'
  // Connection.query(`SELECT * FROM users WHERE email = '${email}'`, (error, results, fields) => {
  //   if (error) throw error;
  //   console.log(results.length)
  // })
  generateAuthToken(3, ((token) => {
    console.log(token)
  }))
})

router.get('/userDetails', auth, async (req, res) => {
  fetchUserDetails(req.user.email, ((results) => {
    res.status(200).send(results)
  }))
})

router.get('/stalkUser', auth, async (req, res) => {
  try {

    switch (req.user.email) {
      case req.query.email:
        return res.status(400).send({ error: 'You cannot stalk yourself' })
        break;
    
      default:
        fetchUserDetails(req.query.email, ((results) => {
          console.log(req.user.id)
          stalker(req.user.id, results.id, (() => {
            res.status(200).send(results)
          }))
        }))
        break;
    }

  } catch (error) {
    console.log(error)
    res.status(400).send()
  }
})

router.post('/addContacts', auth, async (req, res) => {
  try {
    await addContacts(req.user.id, req.query.phone, req.query.instagram_link)
    res.status(200).send()
  } catch (error) {
    console.log(error)
    res.status(400).send()
  }
})

router.post('/signin', async (req, res) => {
  confirmToken(req.query.token, ((status) => {
    switch (status) {
      case false:
        return res.status(401).send({ error: 'Invalid token' })
        break;

      default:
        break;
    }
  }))

  axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${req.query.token}`)
    .then((resp) => {
      Connection.query(`SELECT * FROM users WHERE email = '${resp.data.email}'`, async (error, results, fields) => {
        if (error) {
          res.status(400).send()
          throw error;
        };

        switch (results.length) {
          case 0:
            // create a user if he does not exist
            await createUser(resp.data.given_name, resp.data.family_name, resp.data.email, resp.data.picture, ((status) => {
              if(status == false) return res.status(400).send()
            }))

            fetchUserId(resp.data.email, ((id) => {
              generateAuthToken(id, ((token) => {
                return res.status(200).send({ token })
              }))
            }))
            break;

          default:
            // login a user if he exists

            generateAuthToken(results[0].id, ((token) => {
              return res.status(200).send({ token })
            }))
            break;
        }
      })
    })
})

module.exports = router