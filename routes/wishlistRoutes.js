const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
//Wishlistde READ
router.get('/', authMiddleware, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
        res.json(wishlist ? wishlist.products : []);
    } catch (err) {
        res.status(500).json({ message: 'Server xətası' });
    }
});
//Yaratmaq
router.post('/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user.id, products: [productId] });
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
            }
        }

        await wishlist.save();
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: 'Server xətası' });
    }
});
//Silmek

router.delete('/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) return res.status(404).json({ message: 'Wishlist tapılmadı' });

        wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
        await wishlist.save();
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: 'Server xətası' });
    }
});
module.exports = router;
