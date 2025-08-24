const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');


//yaratmaq
router.post('/products', authMiddleware , async (req, res) => {
    try {
        const { name, category, price, description, image } = req.body;
        const product = new Product({ name, category, price, description, image });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.log("Product POST Xətası:", err);  // konsolda xətanı göstərir
        res.status(500).json({ message: "Mehsul elave edile bilmedi", error: err.message });
    }
});

//butun mehsullari gormek
router.get('/products', authMiddleware , async (req , res)=>{
    try{
        const products = await Product.find();
        res.json(products);
    }catch(err){
        res.status(500).json({message: 'Server xetasi'});
    }
});
//daxil etdiyimiz id ile mehsul gormek
router.get('/products/:id', authMiddleware , async (req , res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Məhsul tapılmadı' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server xətası' });
    
    }
});
//mehsulu yenilemek yeni update
router.put('/products/:id', authMiddleware , async (req, res) => {
    try {
        const { name, category, price, description, image } = req.body;
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            { name, category, price, description, image },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: "Məhsul tapılmadı" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Server xətası" });
    }
});

//daxil etdiyimiz id ye gore mehsul silmek delete
router.delete('/products/:id', authMiddleware , async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Məhsul tapılmadı" });
        res.json({ message: "Məhsul uğurla silindi" });
    } catch (err) {
        res.status(500).json({ message: "Server xətası" });
    }
});


module.exports=router;