const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB qoşuldu'))
.catch((err) => console.log('MongoDB xətası:', err));

const authRoutes = require('./routes/userRoutes');
app.use('/api/auth', authRoutes);

app.use('/api', productRoutes);

app.get('/', (req, res) => {
    res.send('Techymart Backend hazırdır!');
});

app.listen(PORT, () => {
    console.log(`Server ${PORT}-də işə düşdü`);
});
