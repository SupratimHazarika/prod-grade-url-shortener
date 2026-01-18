const { encodeBase62 } = require('../utils/base62');
const { redisClient } = require('../config/redis');

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

        const cachedUrl = await redisClient.get(cacheKey)
        if(cachedUrl){
            console.log('CACHE HIT')
            return cachedUrl
        }

        console.log('CACHE MISS');

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











