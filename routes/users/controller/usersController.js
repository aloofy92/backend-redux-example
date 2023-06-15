const User = require('../model/User')
const jwt = require('jsonwebtoken')
const { createUser, hashPassword, comparePasswords } = require('./usersHelper')

module.exports = {
    login: async (req, res) => {
        try {
            console.log(req.headers);
            
            //check if user exists / get the user form the db
            let foundUser = await User.findOne({username: req.body.username})
            if (!foundUser) {
                 throw {
                    status: 404,
                    message: "User Not Found"
                }
            }          

            // check if password matches
            let checkedPassword = await comparePasswords(req.body.password, foundUser.password)
            if (!checkedPassword) {
                throw {
                    status: 401,
                    message: "Invalid Password"
                }
            }
            // console.log(foundUser)
            let payload = {
                id: foundUser._id,
                username: foundUser.username
            }

            let token = await jwt.sign(payload, process.env.SUPER_SECRET_KEY, {expiresIn: 60*60})
            
            res.status(200).json({
                username: req.body.username,
                message: "Successful Login!!",
                token: token
            })  
        } catch (error) {
            res.status(error.status).json(error.message)
        }
    },
    register: async (req, res) => {
        try {
            //if foundUser exists throw an error
            let foundUser = await User.findOne({username: req.body.username})
            if (foundUser) {
                throw {
                    status: 409,
                    message: "User Exists"
                }
            } 

            let newUser = await createUser(req.body)
            
            // hash password
            let hashedPassword = await hashPassword(newUser.password)
            // console.log(hashedPassword);

            //update newUser object with hashed password
            newUser.password = hashedPassword

            //saves newUser to DB
            let savedUser = await newUser.save()

            res.status(200).json({
                    userObj: savedUser,
                    message: "Successfully Registered"
                }) 
        } catch (error) {
            res.status(error.status).json(error.message)
        }
        
    },
    authtoken: async (req, res) => {
        console.log('!@-------req.decoded-------@!')
        console.log(req.decoded)
        
        let foundUser = await User.findById(req.decoded.id)

        // you can re-issue the token to reset the expiration,
        // this isn't less secure, it is a design decision that can be less secure
        //
        // let payload = {
        //     id: foundUser._id,
        //     username: foundUser.username
        // }
        // let token = await jwt.sign(payload, process.env.SUPER_SECRET_KEY, {expiresIn: 5*60})
        // res.status(200).json({
        //     username: foundUser.username,
        //     message: "Successful Token Login!!",
        //     token: token
        // })

        res.status(200).json({
            username: foundUser.username,
            message: "Successful Token Login!!"
        })


    }
    

}

// const login = (req, res) => {
//     return {
//         username: req.body.username
//     }
// }
//
// module.exports = {
//     login
// }