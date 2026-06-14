const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {

    const { username, password } = req.body
    

    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {

       return res.json({ success: true, message: 'Login successful' })
    }

    res.status(401).json({ success: false, message: 'Login failed' })
})

module.exports = router;