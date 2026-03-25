import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDb Connected Successfully');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDb;