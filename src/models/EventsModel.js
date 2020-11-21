const jwt = require('jsonwebtoken')
const Connection = require('../db/mysql')
const { OAuth2Client } = require('google-auth-library')

newEvent = async (id, date, title, message) => {
    Connection.query(`INSERT INTO events 
    (user_id, 
    event_date,
    event_title,
    event_message) 
    VALUES (${id}, '${date}', '${title}', '${message}')`, (error, results, fields) => {
        if (error) throw error;
        return;
    })
}

module.exports = {
    newEvent
}