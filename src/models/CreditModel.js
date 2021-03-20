const Connection = require('../db/mysql')

addCredit = async (id, name, message) => {
    Connection.query(`INSERT INTO credits
    (user_id, name, message) VALUES 
    (
        ${id},
        '${name}',
        '${message}'
    )`, (error, results, fields) => {
        if (error) throw error;
        return;
    })
}

deleteCredit = async (id) => {
    Connection.query(`DELETE FROM credits WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return;
    })
}

getCredits = async (callback) => {
    Connection.query(`SELECT * FROM credits`, (error, results, fields) => {
        if (error) throw error;
        return  callback(results);
    })
} 

module.exports = {
    getCredits,
    deleteCredit,
    addCredit
}

