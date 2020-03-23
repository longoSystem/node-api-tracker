const tracker = require('../api/tracker');

async function create(request, response) {
    try {
        let data = await tracker.create(request.body);
        if (data == 1) {
            response.status(200).json('Operação realizadas com sucesso!');
        } else {
            response.status(500).json('Não foi possível realizar a operação, tente novamente!');
        }
    } catch (error) {
        console.log(error)
    }
}

async function update(request, response) {
    try {
        let data = await tracker.update(request.body);
        if (data == 1) {
            response.status(200).json('Operação realizadas com sucesso!');
        } else {
            response.status(500).json('Não foi possível realizar a operação, tente novamente!');
        }
    } catch (error) {
        console.log(error)
    }
}

async function findAll(request, response) {
    try {
        response.status(200).json(await tracker.findAllUserTracker());
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    create,
    update,
    findAll
}