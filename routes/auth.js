const express = require('express');
const router = express.Router();

// controller
const { register, login, deleteUser, update, updatePassword } = require('../controllers/auth');

// middleware
const { authCheck, adminCheck } = require("../middlewares");

router.post('/user', register);
router.post('/user/login', login);

router.put('/user', authCheck, update);
router.put('/user/change-password', authCheck, updatePassword);

router.delete('/user/:id', authCheck, adminCheck, deleteUser);




module.exports = router;