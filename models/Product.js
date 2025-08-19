const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Telefon', 'Notebook', 'Planşet'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    image: String 
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
