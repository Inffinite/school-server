const Connection = require('../db/mysql')

addFaq = (userid, title, message) => {
    Connection.query(`INSERT INTO faq (user_id, title, message) VALUES (${userid}, '${title}', '${message}')`, (error, results, fields) => {
        if (error) throw error;
        return
    })
}

deleteFaq = (id) => {
    Connection.query(`DELETE FROM faq WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return
    })
}

deleteFaqs = () => {
    Connection.query(`DELETE FROM faq`, (error, results, fields) => {
        if (error) throw error;
        return
    })
}

getFaqs = (callback) => {
    Connection.query(`SELECT * FROM faq`, (error, results, fields) => {
        if (error) throw error;
        return callback(results)
    })
}

module.exports = {
    addFaq,
    deleteFaq,
    deleteFaqs,
    getFaqs
}