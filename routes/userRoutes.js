const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ========================
// REGISTER
// ========================
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Body yoxlaması
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Zəhmət olmasa bütün sahələri doldurun" });
        }

        // Email artıq varsa, istifadəçini qeydiyyata alma
        const userExisting = await User.findOne({ email });
        if (userExisting) {
            return res.status(400).json({ message: "Bu email artıq mövcuddur" });
        }

        // Şifrəni hash-ləyirik
        const hashedPassword = await bcrypt.hash(password, 10);

        // Yeni istifadəçi yaradırıq
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Token yaradırıq
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Cavab olaraq istifadəçi və token göndəririk
        res.status(201).json({ user, token });

    } catch (err) {
        // Xətanı konsola yazdırırıq ki, görək problem nədir
        console.log("Register Xətası:", err);
        res.status(500).json({ message: 'Server xətası', error: err.message });
    }
});


// ========================
// LOGIN
// ========================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // İstifadəçini tapırıq
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'İstifadəçi tapılmadı' });

        // Şifrəni yoxlayırıq
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Şifrə səhvdir' });

        // Token yaradırıq
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ user, token });
    } catch (err) {
        res.status(500).json({ message: 'Server xətası' });
    }
});

module.exports = router;
