const db = require('../common/db');

async function createPurchase(userId, data) {
  const { product_id, quantity, price } = data;

  const total_amount = quantity * price;

  // Start transaction
  return await db.transaction(async (trx) => {

    // 1️⃣ Insert purchase record
    await trx('purchases').insert({
      user_id: userId,
      product_id,
      quantity,
      price,
      total_amount
    });

    // 2️⃣ Increase stock
    await trx('products')
      .where({ id: product_id, user_id: userId })
      .increment('stock_quantity', quantity);

  });
}

module.exports = {
  createPurchase
};
