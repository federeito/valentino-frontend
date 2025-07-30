import { models } from "mongoose";

const { Schema, model } = require ('mongoose');

const OrderSchema = new Schema({
    line_items: Object, // This will store the array of product details as received from the checkout
    name: String,
    email: String,
    city: String,
    zip: String,
    address: String,
    state: String,
    paid: Boolean,
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});

export const Order = models?.Order || model('Order', OrderSchema);