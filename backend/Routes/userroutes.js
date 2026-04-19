const express = require('express');
const {handleUserSignUp} = require('../Controllers/user');
const router = express.Router();

router.post('/' , handleUserSignUp);

module.exports = router;