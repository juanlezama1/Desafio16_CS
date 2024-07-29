import {Schema, model} from "mongoose"
import paginate from "mongoose-paginate-v2"

// Prototipo de un producto en la DB

const productSchema = new Schema ({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    thumbnail: {
        type: Array,
        required: true,
        default: []
    },

    stock: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        enum: ['Meals', 'Beverages', 'Other'],
        default: 'Meals',
        required: true
    },

    status: {
        type: Boolean,
        required: true
    }
})

// Añado la extensión del pagination
productSchema.plugin(paginate)

// Exporto este prototipo en mi colección
export const productModel = model ("products", productSchema)