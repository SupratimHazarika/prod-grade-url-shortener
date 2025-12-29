const { createShortUrl, resolveShortUrl } = require('../../src/services/url.service');

describe('URL service', () => {

    test('should create a short URL for a valid URL', () => {
        const result = createShortUrl('https://example.com');

        expect(result.shortCode).toBeDefined();
        expect(result.originalUrl).toBe('https://example.com');
    });

    test('Should resolve a previously created URL', () => {
        const { shortCode } = createShortUrl('https://example.com');
        const resolvedUrl = resolveShortUrl(shortCode);

        expect(resolvedUrl).toBe('https://example.com');
    });

    test('Should return null for non existant shortUrl', () => {
        const resolvedUrl = resolveShortUrl('nonexistent');

        expect(resolvedUrl).toBeNull();
    });

})