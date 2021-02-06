const express = require('express')
const router = new express.Router()
const Connection = require('../db/mysql')
const axios = require('axios')
const auth = require('../middleware/auth')
const { download } = require('../dp/dp')
const {
    createUser,
    confirmToken,
    generateAuthToken,
    fetchUserDetails,
    stalker,
    addContacts,
    addCourse,
    users,
    addAdmission,
    fetchUserDetailsById,
    getContacts,
    getAdmission,
    checkDetails,
    editAdmission,
    editCourse,
    editContacts,
    editRole,
    addBio,
    getBio,
    getCourse,
    logout,
    admissionConfirm
} = require('../models/UserModel')
const moment = require('moment');
const { query } = require('../db/mysql')


router.get('/stuff', async (req, res) => {
    // download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function () {
    //     console.log('downloaded')
    //     res.status(200).send()
    // });

    console.log(req.query.stuff)
    res.status(400).send()
})

router.get('/hello', async (req, res) => {
    // var email = 'louislaizr4@gmail.com'
    // Connection.query(`SELECT * FROM users WHERE email = '${email}'`, (error, results, fields) => {
    //   if (error) throw error;
    //   console.log(results.length)
    // })
    // generateAuthToken(3, ((token) => {
    //   console.log(token)
    // }))

    res.status(200).send({ message: "f" })
})

router.get('/userDetails', auth, async (req, res) => {
    fetchUserDetails(req.query.id, ((results) => {
        res.status(200).send(results)
    }))
})

router.get('/me', auth, async (req, res) => {
    res.status(200).send(req.user)
})

router.post('/bio', auth, async (req, res) => {
    addBio(req.user.id, req.query.message)
    res.status(201).send()
})

router.get('/getBio', auth, async (req, res) => {
    getBio(req.query.id, ((results) => {
        res.status(200).send(results)
    }))
})

router.post('/addDetails', auth, async (req, res) => {
    console.log('started')

    try{
        await addAdmission(req.user.id, req.query.admission, req.query.initial, ((status) => {
            if(status == false){
                res.status(200).send({ message: "The admission you entered is already in use." })
            }
        }))

        console.log('done')
    
        await addCourse(req.user.id, req.query.course)
    
        await addContacts(req.user.id, req.query.phone)
    
        if(req.query.role != 'student'){
            await editRole(req.query.role, req.user.id)
        }    
    
        res.status(200).send()
    } catch(e){
        res.status(400).send()
    }
})

router.post('/editDetails', auth, async (req, res) => {
    // phone course link admission role
    try {
        if (req.query.admission) {
            await editAdmission(req.query.admission, req.query.initial, req.user.id)
        }

        if (req.query.course) {
            await editCourse(req.query.course, req.user.id)
        }

        if (req.query.phone) {
            await editContacts(req.query.phone, req.user.id)
        }

        if (req.query.role) {
            await editRole(req.query.role, req.user.id)
        }

        res.status(200).send()
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/userDetailsId', auth, async (req, res) => {
    fetchUserDetailsById(req.user.id, ((results) => {
        res.status(200).send(results)
    }))
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

router.post('/addContacts', auth, async (req, res) => {
    try {
        await addContacts(req.user.id, req.query.phone, req.query.instagram_link)
        res.status(200).send()
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
})

router.get('/getContacts', auth, async (req, res) => {
    getContacts(req.query.id, ((results) => {
        res.status(200).send(results)
    }))
})

router.post('/addCourse', auth, async (req, res) => {
    try {
        await addCourse(req.user.id, req.query.course_name)
        res.status(200).send()
    } catch (error) {
        res.status(400).send()
    }
})

router.get('/getCourse', auth, async (req, res) => {
    try {
        await getCourse(req.query.id, ((course) => {
            res.status(200).send(course)
        }))  
    } catch (error) {
        res.status(400).send()
    }
})

router.get('/admissionConfirm', auth, async (req, res) => {
    try {
        await admissionConfirm(req.query.number, req.query.initial, req.user.id, ((status) => {
            if(status == true){
                res.status(200).send({ status: true })
            } else {
                res.status(200).send({ status: false })
            }
        }))
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/addAdmission', auth, async (req, res) => {
    try {
        await addAdmission(req.user.id, req.query.admission, req.query.initials, ((status) => {
            switch (status) {
                case true:
                    return res.status(200).send()
                    break;

                case false:
                    return res.status(400).send({ error: 'Admission is already in use' })
                    break;

                default:
                    break;
            }
        }))
    } catch (error) {
        res.status(400).send()
    }
})

router.get('/checkDetails', auth, async (req, res) => {
    checkDetails(req.user.id, ((results) => {
        res.status(200).send({ status: results })
    }))
})

router.get('/getAdmission', auth, async (req, res) => {
    getAdmission(req.query.id, ((results) => {
        res.status(200).send(results)
    }))
})

router.get('/users', auth, async (req, res) => {
    try {
        await users((results) => {
            res.status(200).send(results)
        })
    } catch (error) {
        req.status(400).send()
    }
})

router.get('/logout', auth, async (req, res) => {
    try {
        await logout(req.user.id)
        res.status(200).send()
    } catch (error) {
        req.status(400).send()
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
            console.log(resp.data)
            Connection.query(`SELECT * FROM users WHERE email = '${resp.data.email}'`, async (error, results, fields) => {
                if (error) {
                    res.status(400).send()
                    throw error;
                };

                switch (results.length) {
                    case 0:
                        // create a user if he does not exist
                        await createUser(resp.data.given_name, resp.data.family_name, resp.data.email, resp.data.picture, req.query.role, moment().format(), ((status) => {
                            if (status == false) {
                                return res.status(400).send()
                            } else {
                                fetchUserId(resp.data.email, ((id) => {
                                    generateAuthToken(id, ((token) => {
                                        console.log('token' + token)
                                        return res.status(200).send({ token })
                                    }))
                                }))
                            }

                        }))
                        break;

                    default:
                        // login a user if he exists

                        generateAuthToken(results[0].id, ((result) => {
                            return res.status(200).send(result)
                        }))
                        break;
                }
            })
        })
})

module.exports = router