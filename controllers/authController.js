const { response, request } = require('express')

const User = require('../model/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 

    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);

        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '90s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        console.log(roles);

        /**
         * set refresh token cookie
         * @see https://ithelp.ithome.com.tw/articles/10251288 Cookies - SameSite Attribute 
         * if set sameSite to 'None', then cookies won't be set in same site domain
         * or commend out 'secure: true'
         */
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', /** secure: true */ maxAge: 24 * 60 * 60 * 1000 });
        // 如果要設定access token到cookie的話 下面打開
        // set access token cookie
        // res.cookie('accessJWT', accessToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };