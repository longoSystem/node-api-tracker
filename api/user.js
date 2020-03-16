const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.NODE_POSTGRESQL_USR,
  host: process.env.NODE_POSTGRESQL_HOST,
  database: process.env.NODE_POSTGRESQL_BASE,
  password: process.env.NODE_POSTGRESQL_PWD,
  port: process.env.NODE_POSTGRESQL_PORT,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

module.exports = {
    getUsers
}