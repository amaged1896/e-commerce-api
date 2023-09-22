import mongoose from "mongoose";

export const connection = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/e-commerce-api')
        .then(() => console.log('Database connection established successfully'))
        .catch((err) => console.log('Database connection failed', err.message));
}; 