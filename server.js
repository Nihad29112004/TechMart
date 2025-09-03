const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const authRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); 
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

app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api/orders', orderRoutes);  
app.use('/api/cart', cartRoutes);  
app.use('/api/payment', paymentRoutes); 

app.get('/', (req, res) => {
    res.send('Techymart Backend hazırdır!');
});

app.listen(PORT, () => {
    console.log(`Server ${PORT}-də işə düşdü`);
});
