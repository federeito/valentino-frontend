import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    isApproved: { type: Boolean, default: false },
    canViewPrices: { type: Boolean, default: false },
    approvedAt: { type: Date },
    approvedBy: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

export const User = models.User || model('User', UserSchema);
