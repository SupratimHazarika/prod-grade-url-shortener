const { encodeBase62 } = require('../utils/base62');

function createUrlService(urlRepository){

    async function createShortUrl(originalUrl){
        if(!originalUrl){
            throw new Error('Invalid URL');
        }

        const id = await urlRepository.getNextId()
        const shortCode = encodeBase62(id)
        await urlRepository.create({originalUrl, shortCode, id})

        return shortCode
    }

    async function resolveShortUrl(shortCode){
        let record = await urlRepository.findByShortCode(shortCode);
        return record ? record.originalUrl : null;
    }

    return {
        createShortUrl,
        resolveShortUrl
    }
}

module.exports = createUrlService;











