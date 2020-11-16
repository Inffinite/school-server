const Connection = require('../db/mysql')

addSuggestion = async (id, title, message) => {
    Connection.query(`INSERT INTO suggestions 
    (user_id, title, message) VALUES 
    (
        ${id}, 
        '${title}',
        '${message}'
    )`, (error, results, fields) => {
        if (error) throw error;
        return;
    })
}

getSuggestions = async (userid, callback) => {
    // if userid is provided fetch suggestions from that id

    if (userid == null) {
        Connection.query(`SELECT * FROM suggestions`, (error, results, fields) => {
            if (error) {
                console.log(error)
                return callback(false)
            };
            if (results.length == 0) {
                return callback(false)
            }
            return callback(results);
        })
    } else{
        Connection.query(`SELECT * FROM suggestions WHERE user_id = ${userid}`, (error, results, fields) => {
            if (error) {
                console.log(error)
                return callback(false)
            };
            if (results.length == 0) {
                return callback(false)
            }
            return callback(results);
        })
    }
}

deleteSuggestion = async (id) => {
    Connection.query(`DELETE FROM suggestions WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return;
    })
}

deleteUserSuggestions = async (id) => {
    Connection.query(`DELETE FROM suggestions WHERE user_id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return;
    })
}

module.exports = {
    addSuggestion,
    getSuggestions,
    deleteSuggestion,
    deleteUserSuggestions
}