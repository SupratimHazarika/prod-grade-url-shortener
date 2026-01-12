const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'supratimhazarika',
    database: 'url_shortener'
})

module.exports = pool;

