const  express = require('express');

const {
    createShortUrlController,
    redirectController
} =  require('../controllers/url.controllers');

const urlService = require('../services/url.service');

const router = express.Router();

router.post('/urls', createShortUrlController(urlService))

router.get('/:shortCode', redirectController(urlService))

module.exports = router