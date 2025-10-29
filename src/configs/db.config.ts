import mongoose from 'mongoose';
import dotenv from 'dotenv';

// .env config
dotenv.config({ quiet: true })

const DATABASE_URL: string = process.env.DATABASE_URL;

const connectDB = (): void => {
  mongoose.connect(DATABASE_URL)
    .then(() => console.log(`\x1b[32m[DEBUG] MongoDB Connected!\x1b[0m`))
    .catch(error => console.log(`\x1b[31m[DEBUG] MongoDB Not Connected!\x1b[0m`, error));
};

export default connectDB;