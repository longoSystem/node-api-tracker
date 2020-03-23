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

async function getUsers() {
  console.log('user -> api :: getUsers');
  try {
    let results = await pool.query(`SELECT id, name, email, documento, created_at "createdAt", null as address FROM users ORDER BY id ASC`)
    return results.rows || [];
  } catch (error) {
    console.log(error);
  }
}

async function getUserByDocumento(documento) {
  console.log('user -> api :: getUsersByDocumento');
  try {
    let results = await pool.query(`SELECT id, name, email, documento, created_at FROM users WHERE documento = $1`, [ documento ])
    return results.rowCount || [];
  } catch (error) {
    console.log(error);
  }
}

async function getAddressByUserId(userId) {
  console.log('user -> api :: getAddressByUserId');
  try {
    let sql = `SELECT street, number, neighborhood, city, state FROM address WHERE user_id = $1`;
    let results = await pool.query(sql, [userId]);
    return results.rows || [];
  } catch (error) {
    console.log(error);
  }
}

async function getUserAddress() {
  console.log('user -> api :: getUserAddress');
  try {
    let userList = await getUsers();
    let arrayUserAddress = [];
    for (const [idx, userData] of userList.entries()) {
      let address = await getAddressByUserId(parseInt(userData.id, 10));
        userData.address = address;
        arrayUserAddress.push(userData);
    }
    return arrayUserAddress;
  } catch (error) {
    console.log(error);
  }
}

async function createUser(userData) {
  console.log('user -> api :: createUser');
  try {
    const query = 'INSERT INTO users (name, email, password, documento) VALUES ($1, $2, $3, $4)';
    let result = await pool.query(query, [userData.name, userData.email, userData.password, userData.documento]);
    return result = 1 || 0;
  } catch (error) {
    console.log(error);
  }
}

async function createAddress(address) {
  console.log('user -> api :: createUserAddress');
  try {
    let query = 'INSERT INTO address (user_id, street, neighborhood, number, zip_code, city, state) ';
    query += 'VALUES ($1, $2, $3, $4, $5, $6, $7)';
    let result = await pool.query(query, [address.user_id, address.street, address.neighborhood, address.number, address.zip_code, address.city, address.state]);
    return result = 1 || 0;
  } catch (error) {
    console.log(error);
  }
}

//@Transaction
async function createUserAndAddress(data) {
  console.log('user -> api :: createUserAndAddress');
  const client = await pool.connect();
  try {
    await client.query('BEGIN')
    //create user
    const queryUser = 'INSERT INTO users (name, email, password, documento) VALUES ($1, $2, $3, $4)';
    await client.query(queryUser, [data.name, data.email, data.password, data.documento]);

    //create address
    let queryAddr = 'INSERT INTO address (user_id, street, neighborhood, number, zip_code, city, state) ';
    queryAddr += 'VALUES ((SELECT id FROM users WHERE documento = $1), $2, $3, $4, $5, $6, $7)';
    await client.query(queryAddr, [data.documento, data.street, data.neighborhood, data.number, data.zip_code, data.city, data.state]);
    await client.query('COMMIT')
    return 1;
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

module.exports = {
  getUsers,
  createUser,
  getUserAddress,
  getAddressByUserId,
  createAddress,
  createUserAndAddress,
  getUserByDocumento
}