function createShortUrlController(urlService) {
    return function createShortUrl(req, res) {
        const { url } = req.body || {};

        if (!url || typeof url !== "string"){
            return res.status(400).json({ message: "Invalid or missing URL!"})
        }

        let parsed;
        try {
            parsed = new URL(url);
        } catch {
            return res.status(400).json({ message : "Invalid URL format"})
        }

        if(!['http:', 'https:'].includes(parsed.protocol)){
            return res.status(400).json({ message: "Only Http/Https URLs are allowed"})
        }

        try {
            result = urlService.createShortUrl(url)
            return res.status(201).json(result)
        } catch (error) {
            return res.status(500).json({message: 'Internal server error'})
        }
    };
}

function redirectController(urlService){
    return function redirect(req, res){
        const { shortCode } = req.params || {};

        if(!shortCode){
            return res.status(400).json({message: 'Missing short code'})
        }

        try {
            const originalURL = urlService.resolveShortUrl(shortCode)

            if(!originalURL){
                return res.status(404).json({message: "Short URL not found"})
            }

            return res.redirect(302, originalURL)
        } catch (error) {
            return res.status(500).json({message : "Internal Server error"})
        }
    };
}


module.exports = {
    createShortUrlController,
    redirectController
};