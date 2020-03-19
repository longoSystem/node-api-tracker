const express = require('express');
const router = new express.Router();
const users = require('../api/user');
const userController = require('../controller/user');

router.route('/users')
    .get(userController.getUsers)
    .post(userController.createUser);

router.route('/user-address')
    .get(userController.getUserAddress)
    .post(userController.createUserAndAddress);

module.exports = router;