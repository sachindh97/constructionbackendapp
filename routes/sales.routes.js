const express = require('express');
const router = express.Router();
const verifyToken = require('../common/middleware');
const { createSale,generateInvoice } = require('../controller/sales.controller');

router.use(verifyToken);

router.post('/', async (req, res) => {
  try {
   const result = await createSale(req.user.id, req.body);
    res.json({ message: 'Sale added successfully',data:result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
    try {
            const data = await generateInvoice(req.params.id);
            res.json(data);
    } catch (error) {
    res.status(400).json({ message: error.message });
    
    }

});

module.exports = router;
