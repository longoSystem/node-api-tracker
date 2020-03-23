const users = require('../api/user');

async function getUsers(request, response) {
    console.log('user -> controller :: getUsers');
    try {
        let data = await users.getUsers();
        return response.status(200).json(data);
    } catch (error) {
        console.error(error);
    }
}

async function getUserAddress(request, response) {
    console.log('user -> controller :: getUserAddress');
    try {
        let data = await users.getUserAddress();
        return response.status(200).json(data);
    } catch (error) {
        console.error(error);
    }
}

async function createUser(request, response) {
    console.log('user -> controller :: createUser');
    try {
        let data = await users.createUser(request.body);
        return response.status(200).json(data);
    } catch (error) {
        console.error(error);
    }
}

async function createUserAndAddress(request, response) {
    console.log('user -> controller :: createUser');
    try {
        if (await users.getUserByDocumento(request.body.documento) >= 1) {
            return response.status(401).json({
                "status": "Error",
                "message": "Este documento já está cadastrado."
            });
        }
        let data = await users.createUserAndAddress(request.body);
        return response.status(200).json(data);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getUsers,
    getUserAddress,
    createUser,
    createUserAndAddress
}