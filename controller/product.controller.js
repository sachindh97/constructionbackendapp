const db = require('../common/db');

async function createProduct(userId, data) {
  return db('products').insert({
    user_id: userId,
    ...data
  });
}

async function getProducts(userId) {
  return db('products')
    .where({ user_id: userId })
    .orderBy('id', 'desc');
}

async function updateProduct(id, userId, data) {
  return db('products')
    .where({ id, user_id: userId })
    .update(data);
}

async function deleteProduct(id, userId) {
  return db('products')
    .where({ id, user_id: userId })
    .del();
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
};
