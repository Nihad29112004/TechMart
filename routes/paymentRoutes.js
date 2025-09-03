const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { orderId, cardNumber, expiry, cvv } = req.body;

    if (!orderId || !cardNumber || !expiry || !cvv) {
      return res.status(400).json({ success: false, message: "Zəhmət olmasa bütün sahələri doldurun" });
    }

    if (cardNumber !== '4111111111111111') {
      return res.status(400).json({ success: false, message: 'Kart rədd edildi' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Sifariş tapılmadı" });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Bu sifariş artıq ödənilmişdir' });
    }

    order.paymentStatus = 'paid';
    order.status = 'processing';
    await order.save();

    return res.json({
      success: true,
      message: 'Ödəniş uğurla tamamlandı',
      order,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ success: false, message: 'Server xətası' });
  }
});

module.exports = router;
