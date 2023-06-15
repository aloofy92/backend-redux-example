const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
    console.log("Middleware!!!!")
    try {
        const bearerToken = req.headers.authorization
        if (bearerToken) {
            console.log(bearerToken)
            const token = bearerToken.split(' ')[1]
            let decoded = jwt.verify(token, process.env.SUPER_SECRET_KEY)
            // console.log('!@-------decoded-------@!')
            // console.log(decoded)
            // jwt.verify will check for expiration, code below is the manual version
            // if (decoded.exp < Date.now()/1000) {
            //     throw {
            //         status: 403,
            //         message: "Token Expired"
            //     }
            // }
            req.decoded = decoded
            // req / request object gets passed with the next callback function
            next()  
        } else {
            throw {
                status: 401,
                message: 'Missing Token'
            }
        }
    } catch (error) {
       res.status(error.status || 401).json(error.message) 
    }
    
   
  
}

module.exports = { verifyToken }