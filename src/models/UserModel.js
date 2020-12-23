const jwt = require('jsonwebtoken')
const Connection = require('../db/mysql')
const { OAuth2Client } = require('google-auth-library')
const moment = require('moment')

generateAuthToken = async(userid, callback) => {
    let token = jwt.sign({
        id: userid
    }, process.env.JWT_SECRET)

    Connection.query(`INSERT INTO tokens (user_id, token) VALUES (${userid}, '${token}')`, (error, results, fields) => {
        if (error) throw error;
        callback(token)
    })
}

stalker = async(userid, victimid, callback) => {
    Connection.query(`INSERT INTO stalkers (user_id, stalker_id) VALUES (${victimid}, ${userid})`, (error, results, fields) => {
        if (error) throw error;

        Connection.query(`UPDATE users SET stalkers_count = stalkers_count + 1 WHERE id = ${victimid}`, (error, results, fields) => {
            if (error) throw error;
            return callback();
        })

    })
}

createUser = async(fname, lname, email, profile_pic_url, role, last_action, callback) => {
    Connection.query(`
    INSERT INTO users (fname, lname, email, profile_pic_url, role, last_action) 
    VALUES (
      '${fname}',
      '${lname}',
      '${email}',
      '${profile_pic_url}',
      '${role}',
      '${last_action}'
    )`, (error, results, fields) => {
        if (error) {
            console.log(error)
            return callback(false);
        }
        return callback(true);
    })
}

fetchUserId = async(email, callback) => {
    Connection.query(`SELECT * FROM users WHERE email = '${email}'`, (error, results, fields) => {
        if (error) throw error;
        return callback(results[0].id)
    })
}

fetchUserDetails = async(email, callback) => {
    Connection.query(`SELECT * FROM users WHERE email = '${email}'`, (error, results, fields) => {
        if (error) throw error;
        return callback(results[0])
    })
}

fetchUserDetailsById = async(id, callback) => {
    Connection.query(`SELECT * FROM users WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return callback(results[0])
    })
}

addAdmission = async(id, admission, initials, callback) => {
    Connection.query(`SELECT * FROM admission_numbers WHERE 
  admission_number = ${admission} AND
  admission_initial = '${initials}' AND
  user_id != ${id}`, (error, results, fields) => {
        if (error) throw error;

        if (results.length != 0) {
            return callback(false)
        }
    })

    Connection.query(`SELECT * FROM admission_numbers WHERE user_id = ${id}`, (error, results, fields) => {
        if (error) throw error;

        switch (results.length) {
            case 0:
                // if users admission does not exist add one
                Connection.query(`
                INSERT INTO admission_numbers (
                user_id, 
                admission_number,
                admission_initial
                ) 
                VALUES (
                    ${id},
                    ${admission},
                    '${initials}'
                )`, (error, results, fields) => {
                    if (error) throw error;
                    return callback(true);
                })
                break;

            default:
                // if users course exists, update it
                Connection.query(`UPDATE admission_numbers SET 
                user_id = ${id}, 
                admission_number = ${admission},
                admission_initial = '${initials}' WHERE user_id = ${id}`, (error, results, fields) => {
                    if (error) throw error;
                    return callback(true);
                })
                break;
        }
    })
}

addCourse = async(id, course_name) => {
    Connection.query(`SELECT * FROM course WHERE user_id = ${id}`, (error, results, fields) => {
        if (error) throw error;

        switch (results.length) {
            case 0:
                // if users course does not exist add one
                Connection.query(`
        INSERT INTO course (
          user_id, 
          course_name) 
          VALUES (
            ${id},
            '${course_name}'
          )`, (error, results, fields) => {
                    if (error) throw error;
                    return;
                })
                break;

            default:
                // if users course exists, update it
                Connection.query(`UPDATE course SET 
        user_id = ${id}, 
        course_name = '${course_name}' WHERE user_id = ${id}`, (error, results, fields) => {
                    if (error) throw error;
                    return;
                })
                break;
        }
    })
}

users = async(callback) => {
    Connection.query(`SELECT * FROM users`, (error, results, fields) => {
        if (error) throw error;

        var i;
        for (i = 0; i < results.length; i++) {
            results[i].last_action = moment(results[i].last_action, "DD/MM/YYYY").startOf('hour').fromNow()
        }

        return callback(results);
    })
}

stalkers = async(id, callback) => {
    Connection.query(`SELECT * FROM stalkers WHERE user_id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return callback(results);
    })
}

addContacts = async(id, phone, ig_link) => {
    Connection.query(`SELECT * FROM contacts WHERE user_id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        console.log(results.length)
        switch (results.length) {
            case 0:
                // if no contacts exist add a new one
                Connection.query(`
        INSERT INTO contacts (
          user_id, 
          phone, 
          instagram_link) 
          VALUES (
            ${id},
            '${phone}',
            '${ig_link}'
          )`, (error, results, fields) => {
                    if (error) throw error;
                    return;
                })
                break;

            default:
                // if contact exists update it with the parameters

                Connection.query(`UPDATE contacts SET 
        user_id = ${id}, 
        phone = '${phone}', 
        instagram_link = '${ig_link}' WHERE user_id = ${id}`, (error, results, fields) => {
                    if (error) throw error;
                    return;
                })

                break;
        }
    })
}

editRole = (newRole, id) => {
    Connection.query(`UPDATE users SET role='${newRole}' WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return
    })
}

editAdmission = (admission, initial, id) => {
    Connection.query(`UPDATE admission_numbers SET admission=${admission}, admission_initial='${initial}' WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return
    })
}

editCourse = (course, id) => {
    Connection.query(`UPDATE course SET course_name='${course}' WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return
    })
}

editContacts = (phone, link, id) => {
    Connection.query(`UPDATE contacts SET phone='${phone}', instagram_link='${link}' WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return
    })
}

getContacts = (id, callback) => {
    Connection.query(`SELECT * FROM contacts WHERE user_id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return callback(results);
    })
}

getAdmission = (id, callback) => {
    Connection.query(`SELECT * FROM admission_numbers WHERE user_id = ${id}`, (error, results, fields) => {
        if (error) throw error;
        return callback(results);
    })
}

checkDetails = (id, callback) => {
    Connection.query(`SELECT COUNT(*) AS number FROM admission_numbers WHERE user_id = ${id}`, (error, results, fields) => {
        if (error) throw error;

        if (results[0].number != 0) {
            return callback(true);
        } else {
            return callback(false);
        }
    })
}

// check whether the used google id token is legit
confirmToken = async(token, callback) => {
    const client = new OAuth2Client(process.env.CLIENT_ID)

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        })

        const payload = ticket.getPayload()
        const userid = payload['sub']

    } catch (error) {
        callback(false)
    }

    console.log('Token confirmed')
    return callback(true);
}

module.exports = {
    createUser,
    generateAuthToken,
    fetchUserDetails,
    fetchUserId,
    stalker,
    confirmToken,
    addContacts,
    addCourse,
    addAdmission,
    users,
    stalkers,
    fetchUserDetailsById,
    getContacts,
    getAdmission,
    checkDetails,
    editRole,
    editAdmission,
    editCourse,
    editContacts
}