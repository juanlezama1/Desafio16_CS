import { Router } from "express"
import createFakeProducts from "../controllers/mockController.js"
import { createProduct } from "../controllers/productController.js"

const mocksRouter = Router ()

// GENERACIÓN DE PRODUCTOS FALSOS
mocksRouter.get('/', async (req, res) => {
    try {
        // Creo la cantidad de productos que desee
        const my_products = await createFakeProducts(10)

        // Los cargo en la DB

        for (let product of my_products)

        {
            await createProduct(product)
        }

        res.status(200).send("Se cargaron con éxito 10 productos en la base de datos!")
    }

    catch (error)

    {
        req.logger.error("Error al generar los Fake Products: ", error)
        res.status(500).send("Error al generar los Fake Products")
    }
})

export default mocksRouter