const { request, response } = require('express')
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * @param {request} req 
 * @param {response} res 
 * @param {Function} next 
 * @returns 
 */
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // 如果要使用cookie裡面的token自動帶的話 將下面這行打開...
    // const jwtInCookie = req.cookies?.accessJWT; 
    // verify header jwt or cookie jwt
    if (!authHeader && !jwtInCookie) return res.sendStatus(401);
    let token = "";
    if (authHeader) {
        // Bearer token
        token = authHeader.split(' ')[1];
    } else if (jwtInCookie) {
        console.log("jwt in cookies =>", jwtInCookie);
        token = jwtInCookie;
    }
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decoded.username;
            next();
        }
    );
}

module.exports = verifyJWT