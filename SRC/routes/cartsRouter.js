import { Router } from "express"
import { cartModel } from "../models/carts.js"
import cartCheckout from "../controllers/cartController.js"

const cartsRouter = Router ()

// LECTURA DE UN CARRITO ESPECÍFICO
cartsRouter.get('/:cid', async (req, res) => {
 
    let cart_code = req.params.cid // Obtengo el código del carrito

    // Intento obtenerlo de la DB
    try {
        let my_cart = await cartModel.findById(cart_code).populate('products.id_prod').lean()
        res.status(200).render('templates/home_cart_id', {title: 'Carrito Seleccionado', subtitle: 'Detalle de productos:', cart: my_cart.products})
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El carrito no existe!"})
    }
})

// FINALIZA LA COMPRA DE UN CARRITO

cartsRouter.get('/:cid/purchase', async (req, res) => {

    let cart_code = req.params.cid // Obtengo el código del carrito

    if (!req.session.user)
    
    {
        res.status(400).send("Imposible confirmar compra sin login activo!")
        return
    }

    try {

        const checkout_status = await cartCheckout(cart_code, req.session.user.email)
        checkout_status? res.status(201).send('Orden de compra generada con éxito!'):res.status(400).send('Imposible generar orden de compra, stock insuficiente')
    }

    catch (error)

    {
        req.logger.error("Error al generar el carrito: ", error)
    }
})


// UPDATE DE UN CARRITO ESPECÍFICO
cartsRouter.put('/:cid', async (req, res) => {

    let cart_code = req.params.cid // Obtengo el código del carrito a actualizar
    let updated_cart = req.body // Obtengo los valores del carrito actualizado

    // Busco por ID, lo actualizo y devuelvo el carrito actualizado
    try {
        let my_cart = await cartModel.findByIdAndUpdate(cart_code, updated_cart, {new: 'true'}).populate('products.id_prod').lean()
        res.status(200).render('templates/home_cart_id', {title: 'Carrito Actualizado', subtitle: 'Detalle de productos:', cart: my_cart.products})
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El carrito no existe"})
    }
})

// UPDATE DE CANTIDAD DE PRODUCTOS EN UN CARRITO ESPECÍFICO
cartsRouter.put('/:cid/products/:pid', async (req, res) => {

    let cart_code = req.params.cid // Obtengo el código del carrito a modificar
    let product_code = req.params.pid // Obtengo el código del producto a actualizar cantidad
    let updated_quantity = req.body // Obtengo la cantidad actualizada de ejemplares de ese producto (Objeto JSON con clave 'newQuantity')

    // Busco por ID, actualizo el carrito con la cantidad correspondiente y devuelvo el carrito actualizado
    try {
        let my_cart = await cartModel.findById(cart_code).lean()

        my_cart.products.forEach(product => {
            product.id_prod == product_code && (product.quantity = updated_quantity.newQuantity)
        })

        my_cart = await cartModel.findByIdAndUpdate(cart_code, my_cart, {new: 'true'}).populate('products.id_prod').lean()
        res.status(200).render('templates/home_cart_id', {title: 'Carrito Actualizado', subtitle: 'Detalle de productos:', cart: my_cart.products})
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El carrito no existe"})
        req.logger.error(error)
    }
})

// DELETE DE UN PRODUCTO ESPECÍFICO EN CARRITO
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {

    let cart_code = req.params.cid // Obtengo el código del carrito donde eliminaré el producto
    let product_code = req.params.pid // Obtengo el código del producto a eliminar del carrito

    try {
        // Encuentro el carrito en cuestión
        let my_cart = await cartModel.findById(cart_code).lean()

        // Le saco el producto indicado
        let updated_cart = {
            products: my_cart.products.filter(product => {
                return product.id_prod != product_code
            })
        }

        // Actualizo el carrito en la DB
        my_cart = await cartModel.findByIdAndUpdate(cart_code, updated_cart, {new: 'true'}).populate('products.id_prod').lean()
        res.status(200).render('templates/home_cart_id', {title: 'Carrito Actualizado', subtitle: 'Detalle de productos:', cart: my_cart.products})
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El carrito no existe!"})
        req.logger.error(error)
    }
})

// VACIADO DE UN CARRITO
cartsRouter.delete('/:cid/', async (req, res) => {

    let cart_code = req.params.cid // Obtengo el código del carrito donde eliminaré los productos

    try {
        // Actualizo el carrito vaciando el array de productos
        await cartModel.findByIdAndUpdate(cart_code, {products: []}).lean()

        res.status(200).send('Carrito vaciado con éxito!')
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El carrito no existe!"})
        req.logger.error(error)
    }
})

export default cartsRouter