import {Schema, model} from "mongoose"
import paginate from "mongoose-paginate-v2"
import {cartModel} from "./carts.js"

// Prototipo de un usuario en la DB

const userSchema = new Schema ({

    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        enum: ['Standard_User', 'Admin', 'Premium'],
        default: 'Standard_User',
        required: true
    },

    cartID: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
})

// Añado la extensión del pagination
userSchema.plugin(paginate)

// Antes de guardar un nuevo usuario, que le cree un carrito vacío a ese usuario y le pase la referencia del mismo.

userSchema.pre("save", async function (next) {

    try {
        const newCart = await cartModel.create({})
        this.cartID = newCart._id
    }

    // Si ocurre algún error, que no haga nada
    catch (error) {
        next(error)
    }
})

userSchema.pre("find", async function (next) {
    
    try {
        this.populate('cartID')
    }

    catch (error) {
        //
    }
})

// Exporto este prototipo en mi colección
export const userModel = model ("users", userSchema)