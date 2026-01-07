const createUrlService = require('../../src/services/url.service');
const InMemoryUrlRepository = require('../../src/repositories/url.repository');

describe('URL service', () => {
  let urlService;

  beforeEach(() => {
    const urlRepository = new InMemoryUrlRepository();
    urlService = createUrlService(urlRepository);
  });

  test('should create a short URL for a valid URL', () => {
    const result = urlService.createShortUrl('https://example.com');

    expect(result.shortCode).toBeDefined();
    expect(result.originalUrl).toBe('https://example.com');
  });

  test('should resolve a previously created URL', () => {
    const { shortCode } = urlService.createShortUrl('https://example.com');
    const resolvedUrl = urlService.resolveShortUrl(shortCode);

    expect(resolvedUrl).toBe('https://example.com');
  });

  test('should return null for non-existent short URL', () => {
    const resolvedUrl = urlService.resolveShortUrl('nonexistent');

    expect(resolvedUrl).toBeNull();
  });
});