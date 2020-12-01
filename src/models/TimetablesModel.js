const Connection = require('../db/mysql')

unitAdd = async(name, initials, lecturer, room, course, day, year, slot, callback) => {
    // Connection.query(`SELECT * FROM timetables 
    // WHERE name = '${course}' AND
    // slot = ${slot} AND
    // day = '${day}', AND
    // year = ${year}`, (error, results, fields) => {
    //     if (error) throw error;
    //     return callback(true);
    // })

    Connection.query(`INSERT INTO timetables
    (
        name, 
        initials, 
        lecturer, 
        room, 
        time, 
        course,
        day,
        year,
        slot
    ) VALUES 
    (
        '${name}',
        '${initials}',
        '${lecturer}',
        '${room}',
        '${course}',
        '${day}',
        ${year},
        ${slot}
    )`, (error, results, fields) => {
        if (error) throw error;
        return;
    })
}

checkUnit = async(course, slot, day, year, callback) => {
    Connection.query(`SELECT * FROM timetables 
    WHERE name = '${course}' AND
    slot = ${slot} AND
    day = '${day}', AND
    year = ${year}`, (error, results, fields) => {
        if (error) throw error;
        if (results.length == 0) {
            return callback(false)
        } else {
            return callback(true)
        }
    })
}

module.exports = {
    unitAdd,
    checkUnit
}