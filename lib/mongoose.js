import mongoose from "mongoose";

let isConnected = false;

export async function mongooseconnect() {
    if (isConnected && mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (mongoose.connection.readyState === 1) {
        isConnected = true;
        return mongoose.connection;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }

    try {
        await mongoose.connect(uri);
        isConnected = true;
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}