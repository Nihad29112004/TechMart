const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware'); // Auth middleware əlavə edilir

// Bütün route-lara auth middleware tətbiq edilir
router.use(authMiddleware);

// CREATE - Yeni order yaratmaq
router.post('/', async (req, res) => {
  try {
    const { user, products, totalPrice } = req.body;

    if (!user || !products || products.length === 0 || !totalPrice) {
      return res.status(400).json({ message: 'Zəhmət olmasa bütün məlumatları daxil edin' });
    }

    const newOrder = new Order({ user, products, totalPrice });
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Serverdə xəta baş verdi' });
  }
});

// READ ALL - Bütün order-ları əldə etmək
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'name price');

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Serverdə xəta baş verdi' });
  }
});

// READ BY ID - İd-yə görə order əldə etmək
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products.product', 'name price');

    if (!order) return res.status(404).json({ message: 'Order tapılmadı' });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Serverdə xəta baş verdi' });
  }
});

// UPDATE - Order yeniləmək
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: 'Order tapılmadı' });

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Serverdə xəta baş verdi' });
  }
});

// DELETE - Order silmək
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) return res.status(404).json({ message: 'Order tapılmadı' });

    res.json({ message: 'Order uğurla silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Serverdə xəta baş verdi' });
  }
});

module.exports = router;
