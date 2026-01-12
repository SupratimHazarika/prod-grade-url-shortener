const pool = require("../config/db");

class PostgresUrlRepository{
    async create({ id, shortCode, originalUrl }) {
        const query = `INSERT INTO short_urls(short_code, original_url) 
                       values($1, $2)
                       returning id, short_code, original_url
                       `;

        const values = [shortCode, originalUrl]

        const result = await pool.query(query, values)
        console.log('Inserting:', shortCode, originalUrl);

        return {
            id: result.rows[0].id,
            shortCode: result.rows[0].short_code,
            originalUrl: result.rows[0].original_url,
        }
    }

    async findByShortCode(shortCode) {
        const query = `
        SELECT id, short_code, original_url
        FROM short_urls
        WHERE short_code = $1
        LIMIT 1
        `

        const result = await pool.query(query, [shortCode])

        if(result.rows.length === 0){
            return null;
        }

        return {
            id: result.rows[0].id,
            shortCode: result.rows[0].short_code,
            originalUrl: result.rows[0].original_url
        }
    }
}

module.exports = PostgresUrlRepository;