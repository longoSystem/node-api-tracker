const express = require('express');
const router = new express.Router();
const users = require('../api/user');
const userController = require('../controller/user');
const trackerController = require('../controller/tracker');

router.route('/users')
    .get(userController.getUsers)
    .post(userController.createUser);

router.route('/user-address')
    .get(userController.getUserAddress)
    .post(userController.createUserAndAddress);

router.route('/tracker')
    .post(trackerController.create)
    .put(trackerController.update)
    .get(trackerController.findAll);

module.exports = router;