function createUrlService(urlRepository){
    let idCounter = 0;

    function createShortUrl(originalUrl){
        if(!originalUrl){
            throw new Error('Invalid URL');
        }

        idCounter += 1
        let shortCode = idCounter.toString();

        const record = urlRepository.create({
            id: idCounter, 
            shortCode, 
            originalUrl,
        });
        
        return {
            shortCode: record.shortCode,
            originalUrl: record.originalUrl,
        };
    }

    function resolveShortUrl(shortCode){
        let record = urlRepository.findByShortCode(shortCode);
        return record ? record.originalUrl : null;
    }

    return {
        createShortUrl,
        resolveShortUrl
    }
}

module.exports = createUrlService;











