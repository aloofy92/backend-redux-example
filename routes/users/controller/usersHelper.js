const User = require('../model/User')
const bcrypt = require('bcrypt')

const saltRounds = 10

const createUser = (params) => {
    let newUser = new User({
        username: params.username,
        password: params.password
    })
    return newUser
}

const hashPassword = (password) => {
    let hashedPassword = bcrypt.hash(password, saltRounds)
    return hashedPassword

    // or
    // return bcrypt.hash(password, saltRounds)
}

const comparePasswords = (plaintextPassword, dbPassword) => bcrypt.compare(plaintextPassword, dbPassword)


module.exports = { createUser, hashPassword, comparePasswords }