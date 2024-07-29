import { Router } from "express"
import { createProduct, deleteProduct, updateProduct, readProduct, paginateProducts, readProducts } from "../controllers/productController.js"
import {getUserName, getUserStatus} from "../controllers/userController.js"

const productsRouter = Router ()

// LECTURA DE TODOS LOS PRODUCTOS
productsRouter.get('/', async (req, res) => {

    const {limit} = req.query // Si no se mandó, tendrá el valor 'undefined
    
    let user_name // Si no hay una sesión activa, valdrán 'undefined'
    let admin_user

    try {
        user_name = await getUserName (req) // Devolverá el nombre de usuario del usuario logueado
        admin_user = await getUserStatus (req) // Devolverá si el usuario logueado es admin o no, con true/false
    }

    catch (error) {
        // Caso donde no hay una sesión activa
    }

    const my_products = await readProducts()

    if (my_products.length === 0 ) // Caso de que la DB esté vacía
        res.status(200).render('templates/error', {error_description: "Sin productos por ahora"})
    
    else 

    {
        // En donde hay productos para mostrar, devuelvo la cantidad solicitada
        // O todos los productos en caso que no esté definido el query param limit
        let cantidad_productos_exhibidos
        !limit? cantidad_productos_exhibidos = my_products.length: cantidad_productos_exhibidos = limit

        let standard_user

        if (admin_user) {
            standard_user = false
        }

        else if (admin_user === false) {
            standard_user = true
        }

        else {
            admin_user = false
            standard_user = false
        }
        
        // Caso de que envíen un límite, pero no sea un número
        isNaN(cantidad_productos_exhibidos) || cantidad_productos_exhibidos < 0? res.status(400).render('templates/error', {error_description: "El límite debe ser numérico y mayor a cero"}): (
            (cantidad_productos_exhibidos > my_products.length) && (cantidad_productos_exhibidos = my_products.length),
            res.status(200).render('templates/home', {title: 'Mis Productos', subtitle: `Cantidad de productos exhibidos: ${cantidad_productos_exhibidos}`, products: my_products.splice(0, cantidad_productos_exhibidos), user: user_name, admin_user: admin_user, standard_user: standard_user}))
    }
})

// LECTURA DE TODOS LOS PRODUCTOS EN MODO PAGINATION
productsRouter.get('/pagination', async (req, res) => {

    // Query params que podría recibir. Si no se mandan, tendrán el valor 'undefined'
    let {limit, sort, page, query_status, query_category} = req.query 

    try {
        const paginated_products = await paginateProducts(limit, sort, page, query_status, query_category)
        res.status(200).send(paginated_products)
    }

    catch (error)
 
    {
        res.status(500).send("Error al paginar los productos: ", error)
    }
})

// LECTURA DE UN PRODUCTO ESPECÍFICO
productsRouter.get('/:pid', async (req, res) => {

    let product_code = req.params.pid // Obtengo el código del producto

    // Intento obtenerlo de la DB
    try {
        let my_product = await readProduct(product_code)
        res.status(200).render('templates/home_id', {title: 'Producto Seleccionado:', product: my_product})
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El producto no existe"})
    }
})

// UPDATE DE UN PRODUCTO ESPECÍFICO
productsRouter.put('/:pid', async (req, res) => {

    let product_code = req.params.pid // Obtengo el código del producto a actualizar
    let updated_product = req.body // Obtengo los valores del producto actualizado

    // Busco por ID, lo actualizo y devuelvo el producto actualizado
    try {
        const my_product = await updateProduct (product_code, updated_product)
        res.status(200).render('templates/home_id', {title: 'Producto Actualizado:', product: my_product})
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El producto a actualizar no existe"})
    }
})

// DELETE DE UN PRODUCTO ESPECÍFICO
productsRouter.delete('/:pid', async (req, res) => {

    let product_code = req.params.pid // Obtengo el código del producto a eliminar

    try {
        await deleteProduct(product_code)
        res.status(200).send("Producto específico eliminado")
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El producto a eliminar no existe"})
    }
})

// CREATE DE UN PRODUCTO
productsRouter.post('/', async (req, res) => {

    const new_product = req.body // Obtengo el nuevo producto a cargar

    try {
        const my_product = await createProduct (new_product)
        res.status(200).render('templates/home_id', {title: 'Producto Creado:', product: my_product})
    }

    catch (error)

    {
        res.status(500).send("Error al crear producto: ", error)
    }
})

export default productsRouter