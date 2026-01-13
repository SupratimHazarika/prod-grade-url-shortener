const pool = require("../config/db");

class PostgresUrlRepository{
    async create(originalUrl) {
        const query = `INSERT INTO short_urls (original_url) 
                       values($1)
                       returning id
                       `;

        const result = await pool.query(query, [originalUrl])
    
        return result.rows[0].id;
    }

    async updateShortCode(id, shortCode){
        const query = `UPDATE short_urls
                       SET short_code = $1
                       WHERE id = $2
                       `;
                
        await pool.query(query, [shortCode, id])
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