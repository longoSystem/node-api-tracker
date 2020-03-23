const database = require('../services/database');

async function create(data) {
    console.log('tracker -> api :: create');
    const conn = await database.connect();
    try {
        let sql = "INSERT INTO tracker (user_id, tracked_number) VALUES ($1, $2)";
        let result = await conn.query(sql, [data.userId, data.trackedNumber]);
        return result.rowCount;
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        conn.release();
    }
}

async function update(data) {
    console.log('tracker -> api :: update');
    const conn = await database.connect();
    try {
        let sql = "UPDATE tracker SET tracked_number = $2 WHERE user_id = $1 AND id = $3";
        let result = await conn.query(sql, [data.userId, data.trackedNumber, data.trackerId]);
        return result.rowCount;
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        conn.release();
    }
}

async function findAllUserTracker() {
    console.log('tracker -> api :: findAllUserTracker');
    let conn = await database.connect();
    try {
        let sql = `SELECT 
                    u.name
                    , u.documento
                    , t.tracked_number 
                    , active  
                   FROM tracker t 
                   JOIN users u ON (u.id = t.user_id) 
                   WHERE active = true 
                   ORDER BY u.name ASC`;
        result = await conn.query(sql);
        return result.rows || [];
    } catch (error) {
        console.log(error)
    } finally {
        conn.release();
    }
}

module.exports = {
    create,
    update,
    findAllUserTracker
}