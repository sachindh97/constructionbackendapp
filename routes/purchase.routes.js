const express = require('express');
const router = express.Router();
const verifyToken = require('../common/middleware');
const { createPurchase } = require('../controller/purchase.controller');

router.use(verifyToken);

router.post('/', async (req, res) => {
  try {
    await createPurchase(req.user.id, req.body);
    res.json({ message: 'Purchase added successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
