const {
    createShortUrlController,
    redirectController
} = require('../../src/controllers/url.controllers')

function mockRes(){
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.redirect = jest.fn().mockReturnValue(res)
    return res
}

describe('URL controllers', () => {
    test('create short url returns 201 for valid URL', () => {
        const fakeService = {
            createShortUrl: jest.fn(() => ({
                shortCode: 'abc' ,
                originalUrl: 'https://example.com',
            }))
        };

        const req = {
            body: {
                url: 'https://example.com',
            }
        }
        const res = mockRes();
        const handler = createShortUrlController(fakeService);

        handler(req, res)

        expect(fakeService.createShortUrl).toHaveBeenCalledWith('https://example.com');
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            shortCode: 'abc' ,
            originalUrl: 'https://example.com',
        });
    });

    test('redirect returns 404 when short code is not found', () => {
        const fakeService = {
            resolveShortUrl: jest.fn(() => null)
        }

        const req = {
            params: {
                shortCode: 'abc'
            }
        }

        const res = mockRes();
        const handler = redirectController(fakeService)

        handler(req, res)

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Short URL not found',
        });
    })
})














