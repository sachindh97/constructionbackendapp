const express = require('express');
const router = express.Router();
const verifyToken = require('../common/middleware');
const service = require('../controller//product.controller');

router.use(verifyToken);

router.post('/', async (req, res) => {
  await service.createProduct(req.user.id, req.body);
  res.json({ message: 'Product added' });
});

router.get('/', async (req, res) => {
  const products = await service.getProducts(req.user.id);
  res.json(products);
});

router.put('/:id', async (req, res) => {
  await service.updateProduct(req.params.id, req.user.id, req.body);
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  await service.deleteProduct(req.params.id, req.user.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
