const  express = require('express');

const {
    createShortUrlController,
    redirectController
} =  require('../controllers/url.controllers');

const createUrlService = require('../services/url.service');
const PostgresUrlRepository = require('../repositories/postgres-url.repository');

const router = express.Router();

const urlRepository = new PostgresUrlRepository();
const urlService = createUrlService(urlRepository)

router.post('/urls', createShortUrlController(urlService))

router.get('/:shortCode', redirectController(urlService))

module.exports = router