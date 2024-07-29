import { cartModel } from "../models/carts.js"
import { updateProduct } from "./productController.js"
import { createTicket } from "./ticketController.js"
import { getUserIdByEmail } from "./userController.js"

const cartCheckout = async (cart_id, user_email) => {

    const my_cart = await cartModel.findById(cart_id).lean()

    // Verifico que todo tenga stock

    let stock_ok = true

    my_cart.products.forEach((product) => {
        if (parseInt(product.id_prod.stock) < product.quantity)
            stock_ok = false
    })

    if (!stock_ok)
        return null // Caso de stock insuficiente

    // Descuento el stock y calculo el costo total

    let totalAmount = 0

    for (let product of my_cart.products)
    
    {
        let updated_stock = parseInt(product.id_prod.stock) - product.quantity
        await updateProduct(product.id_prod._id, {stock: updated_stock})
        totalAmount += parseInt(product.id_prod.price)*(product.quantity)
    }

    // Genero la orden de compra(ticket)

    const user_id = await getUserIdByEmail(user_email)
    await createTicket(totalAmount, cart_id, user_id)
    return true // Ticket generado con éxito
}

export default cartCheckout