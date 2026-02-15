const db = require('../common/db');

async function getDashboardData(userId) {

  const totalProducts = await db('products')
    .where({ user_id: userId })
    .count('id as count')
    .first();

  const totalStock = await db('products')
    .where({ user_id: userId })
    .sum('stock_quantity as total')
    .first();

const stockValue = await db('products')
  .where({ user_id: userId })
  .sum({ total: db.raw('stock_quantity * purchase_price') })
  .first();

  const totalSales = await db('sales')
    .where({ user_id: userId })
    .sum('total_amount as total')
    .first();

  const totalProfit = await db('sales')
    .where({ user_id: userId })
    .sum('total_profit as total')
    .first();




  const lowStock = await db('products')
    .where({ user_id: userId })
    .andWhereRaw('stock_quantity < minimum_stock')
    .count('id as count')
    .first();

  return {
    totalProducts: totalProducts.count || 0,
    totalStock: totalStock.total || 0,
    stockValue: stockValue.total || 0,
    totalSales: totalSales.total || 0,
    totalProfit: totalProfit.total || 0,
    lowStock: lowStock.count || 0
  };
}


module.exports = {
  getDashboardData
};
