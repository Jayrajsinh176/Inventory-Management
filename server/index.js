import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import rateLimit from 'express-rate-limit';

import connectDb from './config/db.js';
import validateEnv from './utils/validateEnv.js';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js'
import categoryRoutes from './routes/category.routes.js'
import usersRoutes from './routes/users.routes.js';
import planRoutes from './routes/plan.routes.js';
import alertRoutes from './routes/alert.routes.js';

// validate environment before starting server 
// check .env file there are variable assign or not 
validateEnv();

const app = express();
app.use(express.json());

// security middleware - every one can access 
app.use(cors());

// only allowed origin can access or by default http://localhost:3000 can access it
// app.use(cors({
  // origin : process.env.ALLOWED_ORIGIN?.split(',') || ['http://localhost:3000'],
  // credentials : true,
// }))

// body parsing 
app.use(express.json({ limit : '10mb'}));
app.use(express.urlencoded({ extended : true, limit : '10mb'}));

// Rate limit for auth routes - like users 
const authLimiter = rateLimit({
  windowMs : 15 * 60 * 1000, // 15 minutes
  max : 10, // 10 requests per window
  message: {
    success: false,
    message: 'Too many authentication requests, please try 15 mintues again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// api rate limiter 
const apiLimiter = rateLimit({
  windowMs : 1 * 60 * 1000, // 1 minutes
  max : 200, // 200 requests per minute
  message : {
    success : false,
    message : 'Too many requests, please try again later'
  },
});

app.use('/api/auth',authLimiter);
app.use('/api',apiLimiter);

const PORT = process.env.PORT || 5000;

connectDb();

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/users',usersRoutes);
app.use('/api/company/plan',planRoutes);
app.use('/api/alert', alertRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
