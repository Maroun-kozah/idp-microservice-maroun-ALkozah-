import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3001,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/defaultDb', // Default fallback
    jwtSecret: process.env.JWT_SECRET || 'defaultSecret',
};