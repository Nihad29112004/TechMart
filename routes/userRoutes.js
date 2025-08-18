const express = require('express');       // Express çağırırıq
const router = express.Router();          // Router yaratmaq üçün
const User = require('../models/User');   // User modelini çağırırıq
const bcrypt = require('bcryptjs');       // Şifrələri hash-ləmək üçün
const jwt = require('jsonwebtoken');      // Token yaratmaq üçün
require('dotenv').config();               // .env faylını oxumaq üçün

// ========================
// REGISTER
// ========================
router.post('/register', async(req,res)=>{
    try{
        const {name , email, password} = req.body;
    }

    const userExisiting = await User.findOne({email});
    if(userExisiting){
        return res.status(400).json({message: "Bu email artiq var"})
    }

});

        const hashedPassword = await bcrypt.hash(password, 10);

        const user =new User({name , email , password: hashedPassword});
        await user.save();

         // Token yaradırıq
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ user, token }); // İstifadəçi və token göndəririk
     catch (err) {
        res.status(500).json({ message: 'Server xətası' });
    }


       

// ========================
// LOGIN
// ========================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;  // Frontend-dən gələn məlumatlar

        // Email-i tapırıq
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'İstifadəçi tapılmadı' });

        // Şifrəni yoxlayırıq
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Şifrə səhvdir' });

        // Token yaradırıq
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ user, token }); // İstifadəçi və token göndəririk
    } catch (err) {
        res.status(500).json({ message: 'Server xətası' });
    }
});

module.exports = router; // Route-u ixrac edirik
