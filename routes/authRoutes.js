const express = require('express')
const { registerNewUser, loginUser, verifyUser, googleLogin } = require('../controllers/authControllers')

const router = express.Router()

router.post('/register', registerNewUser)
router.post('/login', loginUser)
router.post('/googleAuth', googleLogin)
router.get('/verify', verifyUser)

module.exports = router