const User = require('../models/userSchema')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET
const CLIENT_ID = process.env.CLIENT_ID
const cookieParser = require('cookie-parser');
const express = require("express")
const app = express();
app.use(cookieParser());
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(CLIENT_ID);
// JWT Generation
const generateTokenAccess = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: '4h',
    });
}

exports.registerNewUser = async (req, res) => {
    const { email, username, password } = req.body

    try {
        const newUser = new User({ email, username, password })

        await newUser.save()

        res.status(201).json({ msg: "Registered!" })
    }
    catch (error) {
        res.status(400).json({ msg: "Registration failed", error: error })
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) return res.status(404).json({ msg: "User Not Found" })
        if (user && (await user.matchPassword(password))) {
            const aToken = generateTokenAccess(user._id);
            res.status(200).json({
                token: {
                    access: aToken
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ msg: "ERROR!", error: error })
    }
}

exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { sub: googleId, email, name, picture } = payload;

        let user = await User.findOne({ googleId });

        if (!user) {
            user = new User({
                googleId,
                email,
                username: name,
                profilePicture: picture,
            });
            await user.save();
        }

        const aToken = generateTokenAccess(user._id);
        res.status(200).json({
            token: {
                access: aToken
            }
        });

    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid Google Token/Credentials' });
    }
}

exports.verifyUser = async (req, res) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, jwtSecret);

            const user = await User.findById(decoded.id).select('_id username email');
            if (!user) return res.status(401).json({
                error: 'Not authorized, token failed'
            })
            res.status(201).json({ success: 'Verified', user: user })

        } catch (error) {
            res.status(401).json({ error: 'Not authorized, token failed' })
        }
    }

    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token' })
    }
}