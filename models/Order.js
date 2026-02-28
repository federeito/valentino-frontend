import { models } from "mongoose";

const { Schema, model } = require('mongoose');

const LineItemSchema = new Schema({
    title: String,
    originalTitle: String,
    quantity: Number,
    unit_price: Number,
    total_price: Number,
    productId: String,
    color: {
        name: String,
        code: String,
        available: Boolean,
        _id: String
    },
    código: String
}, { _id: false });

const OrderSchema = new Schema({
    line_items: [LineItemSchema],
    name: String,
    email: String,
    city: String,
    zip: String,
    address: String,
    state: String,
    paid: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ['mercadopago', 'transfer'] },
    statusHistory: [{
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: String
    }]
}, {
    timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);