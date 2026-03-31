import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import connectDb from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js'
import categoryRoutes from './routes/category.routes.js'
import usersRoutes from './routes/users.routes.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDb();

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/users',usersRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
