const jwt = require('jsonwebtoken')
const Connection = require('../db/mysql')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        Connection.query(`SELECT COUNT(*) AS number FROM tokens WHERE token = '${token}'`, (error, results, fields) => {
            if (error) throw error;

            if (results[0].number <= 0) {
                return res.status(401).send({ error: 'Authenticate' })
            } else {
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
            }
        })


    } catch (error) {
        console.log(error)
        res.status(401).send({ error: 'Authenticate' })
    }
}

module.exports = auth