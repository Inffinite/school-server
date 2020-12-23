const jwt = require('jsonwebtoken')
const Connection = require('../db/mysql')

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        Connection.query(`SELECT * FROM users WHERE id = ${decoded.id}`, (error, results, fields) => {
            if (error) {
                throw error;
            };

            if (results.length == 0) {
                // throw error;
                return res.status(401).send({ error: 'Authenticate' })
            }

            req.token = token
            req.user = results[0]
            next()
        })
    } catch (error) {
        console.log(error)
        res.status(401).send({ error: 'Authenticate' })
    }
}

module.exports = auth