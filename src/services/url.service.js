const { encodeBase62 } = require('../utils/base62');
const { redisReadClient, redisClient } = require('../config/redis');

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
        const cacheKey = `short:${shortCode}`

        const cachedUrl = await redisReadClient.get(cacheKey)
        if(cachedUrl){
            return cachedUrl
        }

        let record = await urlRepository.findByShortCode(shortCode);
        if(!record) return null;

        await redisClient.set(cacheKey, record.originalUrl, {
            EX: 3600,
        })

        return record.originalUrl
    }

    return {
        createShortUrl,
        resolveShortUrl
    }
}

module.exports = createUrlService;











