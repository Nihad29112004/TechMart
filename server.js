const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // .env faylını oxumaq

const app = express();
const PORT = 5000;

// ========================
// Middleware
// ========================
app.use(cors());         // Frontend ilə əlaqə üçün
app.use(express.json()); // JSON məlumatları oxumaq üçün

// ========================
// MongoDB-ə qoşulmaq
// ========================
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB qoşuldu'))
.catch((err) => console.log('MongoDB xətası:', err));

// ========================
// Auth route-u əlavə edirik
// ========================
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ========================
// Test üçün root route
// ========================
app.get('/', (req, res) => {
    res.send('Techymart Backend hazırdır!');
});

// ========================
// Serveri işə salırıq
// ========================
app.listen(PORT, () => {
    console.log(`Server ${PORT}-də işə düşdü`);
});
