import mongoose, { Schema, models } from "mongoose";

// Delete the existing model to avoid caching issues
if (models.User) {
    delete models.User;
}

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    image: { type: String },
    provider: { type: String },
    isApproved: { type: Boolean, default: false },
    canViewPrices: { type: Boolean, default: true },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    cuitCuil: { type: String },
    businessName: { type: String },
    shippingAddress: { type: String },
}, {
    timestamps: true,
    strict: false
});

export const User = models.User || mongoose.model('User', UserSchema);
