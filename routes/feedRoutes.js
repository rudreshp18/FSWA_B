const express = require('express')
const { retrieveFeeds, postFeed, userFeed, uploadFiles } = require('../controllers/feedControllers')

const router = express.Router()

router.post('/upload', uploadFiles, postFeed)
router.get('/get', userFeed)
router.get('/feeds', retrieveFeeds)

module.exports = router