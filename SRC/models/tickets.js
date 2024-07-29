import {Schema, model} from "mongoose"
import crypto from 'crypto'

// Prototipo de una Orden de Compra (OC) en la DB

const ticketSchema = new Schema ({

    code: {
        type: String,
        required: true,
        default: crypto.randomUUID()
    },

    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now()
    },

    amount: {
        type: Number,
        required: true
    },

    cart: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'carts'
    },

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
})

ticketSchema.pre('find', async function(next){

    try {
        this.populate('cart')
        this.populate('user')
        next()
    }

    catch (error) {
        //
    }
})

// Exporto este prototipo en mi colección
export const ticketModel = model ("tickets", ticketSchema)