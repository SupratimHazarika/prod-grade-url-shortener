const pool = require("../config/db");

class PostgresUrlRepository{
    async getNextId(){
        const query = `SELECT nextval('short_urls_id_seq') AS id`
        const result = await pool.query(query)
        return result.rows[0].id;
    }

    async create({originalUrl, shortCode, id}) {
        const query = `
            INSERT INTO short_urls (id, short_code, original_url) 
            values($1, $2, $3) 
        `;

        await pool.query(query, [id, shortCode, originalUrl])
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