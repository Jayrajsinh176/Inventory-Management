import express from 'express';
import connectDb from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDb();

app.get('/',(req,res)=>{
    res.send('hello form backend server' );
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

