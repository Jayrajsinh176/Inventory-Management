import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDb();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Inventory Management API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
