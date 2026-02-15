const express = require('express');
const router = express.Router();
const verifyToken = require('../common/middleware');
const { getDashboardData,generateInvoice } = require('../controller/common.controller');

router.use(verifyToken);

router.get('/dashboard', async (req, res) => {
  try {
    const data = await getDashboardData(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




module.exports = router;
