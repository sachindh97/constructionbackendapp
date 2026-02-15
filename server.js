require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const purchaseRoutes = require('./routes/purchase.routes');
const salesRoutes = require('./routes/sales.routes');
const commonRoutes = require('./routes/common.routes');
const app = express();


app.use(cors({
  origin: '*'
}));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/purchases',purchaseRoutes);
app.use('/api/sales',salesRoutes);
app.use('/api/common',commonRoutes);


const db = require('./common/db');

db.raw('select 1+1 as result')
  .then(() => console.log('Database Connected ✅'))
  .catch(err => console.log('DB Error ❌', err));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


