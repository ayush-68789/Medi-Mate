const User = require('../models/user');
const path = require('path');

async function handleUserSignup(req, res) {
    const {name, email, password } = req.body;

    await User.create({
        name,
        email,
        password
    });
    
    return res.sendFile(
    path.join(__dirname, '../frontend/pages/dashboard/index.html')
);
}