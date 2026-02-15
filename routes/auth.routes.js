const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser
} = require('../controller/auth.controller');

router.post('/register', async (req, res) => {
    try {
        const result = await registerUser(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const result = await loginUser(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



module.exports = router;
