// createShortURL(originalUrl)
// {
//     return [shortUrl, originalURL]
// }

// resolveShortUrl(shortCode)
// {
//     return originalUrl or null
// }

const urlStore = new Map();
let idCounter = 1;

const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encodeBase62(num){
    let encoded = '';
    while (num > 0) {
        encoded = BASE62_CHARS[num % 62] + encoded;
        num = Math.floor(num / 62);
    }
    return encoded;
}

function createShortUrl(originalUrl){
    if (!originalUrl){
        throw new Error('Invalid URL');
    }

    const id = idCounter++;
    const shortCode = encodeBase62(id)
    
    urlStore.set(shortCode, originalUrl)
    
    return { shortCode, originalUrl }
}

function resolveShortUrl(shortCode){
    return urlStore.get(shortCode) || null
}

module.exports = {
    createShortUrl,
    resolveShortUrl
}












