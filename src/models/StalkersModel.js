const Connection = require('../db/mysql')
const moment = require('moment')

stalker = async (userid, victimid, name, url) => {
    var time = moment().format();

    Connection.query(`INSERT INTO stalkers (user_id, stalker_id, pic_url, name, time) VALUES (${victimid}, ${userid}, '${url}', '${name}', '${time}')`, (error, results, fields) => {
        if (error) throw error;

        Connection.query(`UPDATE users SET stalkers_count = stalkers_count + 1 WHERE id = ${victimid}`, (error, results, fields) => {
            if (error) throw error;
            return;
        })

    })
}

module.exports = {
    stalker
}