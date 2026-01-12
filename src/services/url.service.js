function createUrlService(urlRepository){
    let idCounter = 0;

    async function createShortUrl(originalUrl){
        if(!originalUrl){
            throw new Error('Invalid URL');
        }

        idCounter += 1
        let shortCode = idCounter.toString();

        const record = await urlRepository.create({
            id: idCounter, 
            shortCode, 
            originalUrl,
        });
        
        return {
            shortCode: record.shortCode,
            originalUrl: record.originalUrl,
        };
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











