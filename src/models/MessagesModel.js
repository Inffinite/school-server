const Connection = require('../db/mysql')

addMessage = async (id, title, message, type) => {
    Connection.query(`INSERT INTO messages
    (user_id, title, message, type) VALUES 
    (
        ${id},
        '${title}',
        '${message}',
        ${type}
    )`, (error, results, fields) => {
        if (error) throw error;
        return;
    })
}

checkMessages = async (callback) => {
    Connection.query(`SELECT COUNT(*) AS messages FROM messages`, (error, results, fields) => {
        if (error) throw error;
        callback(results)
    })
}

getMessages = async (userid, callback) => {
    // if userid is provided fetch messages from that id

    if (userid == null) {
        Connection.query(`SELECT 
        users.fname, 
        users.profile_pic_url, 
        users.email, 
        messages.title, 
        messages.message, 
        messages.type,
        messages.created_at, 
        messages.id FROM messages
        INNER JOIN users ON messages.user_id=users.id;`, (error, results, fields) => {
            if (error) {
                console.log(error)
                return callback(false)
            };
            if (results.length == 0) {
                return callback(false)
            }

            for (let i = 0; i < results.length; i++) {
                switch (results[i].type) {
                    case 1:
                        results[i].type = 'suggestion'
                        break;

                    case 2:
                        results[i].type = 'announcement'
                        break;

                    case 3:
                        results[i].type = 'report'
                        break;
                
                    default:
                        break;
                }
            }

            return callback(results);
        })
    } else{
        Connection.query(`SELECT * FROM messages WHERE user_id = ${userid}`, (error, results, fields) => {
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

deleteMessage = async (id) => {
    Connection.query(`DELETE FROM messages WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return;
    })
}

deleteUserMessage = async (id) => {
    Connection.query(`DELETE FROM messages WHERE user_id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return;
    })
}

module.exports = {
    getMessages,
    deleteMessage,
    deleteUserMessage,
    addMessage,
    checkMessages
}