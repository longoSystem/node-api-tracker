const express = require('express');
const router = new express.Router();
const users = require('../api/user');

router.route('/users').get(users.getUsers);

module.exports = router;