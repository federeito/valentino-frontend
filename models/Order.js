import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
    line_items: Object, // This will store the array of product details as received from the checkout
    name: String,
    email: String,
    city: String,
    zip: String,
    address: String,
    country: String,
    paid: Boolean,
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});

export const Order = models.Order || model('Order', OrderSchema);