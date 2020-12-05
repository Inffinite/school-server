const Connection = require('../db/mysql')

addGroup = (name, description, link) => {
    Connection.query(`INSERT INTO whatsappGroups (name, description, link) VALUES ('${name}', '${description}', '${link}')`, (error, results, fields) => {
        if (error) throw error;
        return
    })
}

deleteGroup = (id) => {
    Connection.query(`DELETE FROM whatsappGroups WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return
    })
}

getGroups = (callback) => {
    Connection.query(`SELECT * FROM whatsappGroups`, (error, results, fields) => {
        if (error) throw error;
        return callback(results)
    })
}

module.exports = {
    addGroup,
    deleteGroup,
    getGroups
}