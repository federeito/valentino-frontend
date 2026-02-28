import { models } from "mongoose";

const { Schema, model } = require('mongoose');

const OrderSchema = new Schema({
    line_items: Array,
    name: String,
    email: String,
    city: String,
    zip: String,
    address: String,
    state: String,
    paid: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ['mercadopago', 'transfer'] },
    statusHistory: { type: String, default: 'Pendiente' }
}, {
    timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);