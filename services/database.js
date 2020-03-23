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

module.exports = pool;