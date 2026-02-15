const db = require('../common/db');


async function createSale(userId, data) {

  return await db.transaction(async (trx) => {

    const invoice_no = 'INV-' + Date.now();

    let totalAmount = 0;
    let totalProfit = 0;

    const [saleId] = await trx('sales').insert({
      user_id: userId,
      invoice_no,
      total_amount: 0,
      total_profit: 0
    });

    for (const item of data.items) {

      const product = await trx('products')
        .where({ id: item.product_id, user_id: userId })
        .first();

      if (!product)
        throw new Error('Invalid product');

      if (product.stock_quantity < item.quantity)
        throw new Error('Insufficient stock for ' + product.name);

      // Use custom price OR default
      const selling_price =
        item.selling_price || product.selling_price;

      const total =
        item.quantity * selling_price;

      const profit =
        (selling_price - product.purchase_price) * item.quantity;

      totalAmount += total;
      totalProfit += profit;

      await trx('sale_items').insert({
        sale_id: saleId,
        product_id: item.product_id,
        quantity: item.quantity,
        selling_price,
        total_amount: total,
        profit
      });

      await trx('products')
        .where({ id: item.product_id })
        .decrement('stock_quantity', item.quantity);
    }

    await trx('sales')
      .where({ id: saleId })
      .update({
        total_amount: totalAmount,
        total_profit: totalProfit
      });

    return { saleId, invoice_no };
  });
}



async function generateInvoice(saleId) {

  // 1️⃣ Get main sale
  const sale = await db('sales')
    .where('id', saleId)
    .first();

  if (!sale) {
    throw new Error('Invoice not found');
  }

  // 2️⃣ Get all sale items
  const items = await db('sale_items')
    .join('products', 'sale_items.product_id', 'products.id')
    .select(
      'sale_items.id',
      'sale_items.quantity',
      'sale_items.selling_price',
      'sale_items.total_amount',
      'sale_items.profit',
      'products.name as product_name'
    )
    .where('sale_items.sale_id', saleId);

  // 3️⃣ Return combined result
  return {
    ...sale,
    items
  };
}



module.exports = {
  createSale,
  generateInvoice
};
