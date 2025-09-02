const router = require('express').Router();
const Cart = require('../models/Cart');
const { verifyToken } = require('../middleware/verifyToken'); // auth middleware
const authMiddleware = require('../middleware/authMiddleware');

// elave etmek
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      
      cart = new Cart({ 
        user: req.user.id, 
        products: [{ productId, quantity }] 
      });
    } else {
      // Əgər məhsul artıq cart-dadırsa, quantity artır
      const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// cartlari gormek
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('products.productId');
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});
// silmek
router.post('/remove', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    
    cart.products = cart.products.filter(p => p.productId.toString() !== productId);

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
