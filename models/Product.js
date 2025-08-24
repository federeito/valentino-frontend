import mongoose, { Schema, models, model } from "mongoose";

const ProductSchema = new Schema({
    Título: {type: String, required: true},
    Descripción: {type: String, required: true},
    Precio: {type: Number, required: true},
    Imagenes: [{type: String}],
    Categoria: {type:mongoose.Schema.Types.ObjectId, ref: 'Category'},
    colors: [{
        name: { type: String, required: true },
        code: { type: String, required: true, match: /^#[0-9A-Fa-f]{6}$/ },
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
    }],
    stock: { type: Number, default: 0 }
})

export const Product = models.Product || model('Product', ProductSchema);