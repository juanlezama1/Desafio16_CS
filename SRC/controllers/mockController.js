import {faker} from '@faker-js/faker'

const createFakeProducts = async (products_qty) => {

    let my_products = []

    for (let i=0; i<products_qty; i++)

    {
        const my_product = {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseInt(faker.commerce.price({dec: 0, min: 1500, max: 3700, symbol: ''})),
            stock: faker.number.int({min: 15, max: 80}),
            status: faker.datatype.boolean(0.7),
            thumbnail: faker.image.url({width: 640, height: 480})
        }

        my_products.push(my_product)
    }

    return my_products
}

export default createFakeProducts