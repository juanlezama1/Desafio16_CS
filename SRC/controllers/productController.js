import { productModel } from "../models/products.js"

const createProduct = async(new_product) => {
    let my_product = await productModel.create(new_product)
    my_product = await productModel.findById(my_product._id.toString()).lean()
    return my_product
}

const deleteProduct = async(product_code) => {
    await productModel.findByIdAndDelete(product_code)
}

const updateProduct = async (product_code, updated_product) => {
    let my_product = await productModel.findByIdAndUpdate(product_code, updated_product, {new: 'true'}).lean()
    return my_product
}

const readProduct = async(product_code) => {
    const my_product = await productModel.findById(product_code).lean()
    return my_product
}

const paginateProducts = async(limit, sort, page, query_status, query_category) => {
    !page && (page = 1) // Por default será 1
    !limit && (limit = 10) // Por default será 10
    !sort? (sort = null) : (sort = ({price: sort})) // Por default no los ordenará

    let filters = {}
    query_status && (filters.status = (query_status == 'true')) // Por default hace una búsqueda general
    query_category && (filters.category = query_category) // Por default trae todas las categorías
    
    const paginated_products = await productModel.paginate(filters, {limit: limit, page: page, sort: sort})
    return paginated_products
}

const readProducts = async() => {
    const my_products = await productModel.find().lean()
    return my_products
}

export {createProduct, deleteProduct, updateProduct, readProduct, paginateProducts, readProducts}