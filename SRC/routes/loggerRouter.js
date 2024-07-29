import { Router } from "express"
import mongoose from 'mongoose'
import {createProduct, deleteProduct, updateProduct} from '../controllers/productController.js'

const loggerRouter = Router ()

// GENERACIÓN DE PRODUCTOS FALSOS
loggerRouter.get('/', async (req, res) => {
    
    // Prueba 1: Fatal
    // Imposible conectarse a Base de Datos
    console.log("Prueba 1: Fatal")
    
    const wrong_password = '123456789'

    try {
        await mongoose.connect(`mongodb+srv://lezamaj:${wrong_password}@cluster0.r9uoba0.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Desafio6`)
        req.logger.info(`Conectado correctamente a la base de datos; ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    }

    catch (error)

    {
        req.logger.fatal(`Error al conectarse a la Base de Datos; ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    }
    
    // Prueba 2: Error
    // Intento eliminar un producto que no existe
    console.log("Prueba 2: Error")

    const wrong_productID = '2225489'
    
    try {
        await deleteProduct(wrong_productID)
        req.logger.info("Producto eliminado exitosamente!")
    }

    catch (error)    {
        req.logger.error(`Error al eliminar el producto de la Base de Datos; ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    }

    // Prueba 3: Warning
    // Intentar crear un producto sin pasarle todos los datos obligatorios (required: true) 
    console.log("Prueba 3: Warning")

    const incomplete_product = {
        title: "Producto Incompleto"
    }

    try {
        await createProduct(incomplete_product)
        req.logger.info("Producto creado exitosamente!")
    }

    catch (error)    {
        req.logger.warning(`Error al crear el producto en la Base de Datos; ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    }

    // Prueba 4: Info
    // Actualizo un producto de la Base de Datos
    console.log("Prueba 4: Info")

    const new_price = 700

    try {
        await updateProduct('661efe77302b9a9cfe1bf74a', {price: new_price})
        req.logger.info(`Producto actualizado exitosamente; ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    }

    catch {
        req.logger.warning(`Error al actualizar el producto en la Base de Datos; ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    }

    // Prueba 5: HTTP
    // Registro la solicitud entrante (Método HTTP utilizado y URL Destino)
    console.log("Prueba 5: HTTP")

    req.logger.http(`Solicitud HTTP recibida en la ruta ${req.baseUrl} con método HTTP ${req.method}; ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)

    // Prueba 6: Debug
    // Verifico la dirección IP que ha llamado al servidor
    console.log("Prueba 6: Debug")

    req.logger.debug(`La solicitud HTTP ha sido recibida desde el cliente: ${req.ip}; ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
})

export default loggerRouter