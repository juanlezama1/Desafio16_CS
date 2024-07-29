import productsRouter from './productsRouter.js'
import cartsRouter from './cartsRouter.js'
import cookiesRouter from './cookiesRouter.js'
import sessionsRouter from './sessionsRouter.js'
import usersRouter from './usersRouter.js'
import ticketsRouter from './ticketsRouter.js'
import mocksRouter from './mocksRouter.js'
import loggerRouter from './loggerRouter.js'
import express from 'express'
import __dirname from '../path.js'

const indexRouter = express.Router ()

// Índice de rutas
indexRouter.use('/public', express.static(__dirname + '/public'))
indexRouter.use('/products', productsRouter, express.static(__dirname + '/public'))
indexRouter.use('/carts', cartsRouter, express.static(__dirname + '/public'))
indexRouter.use('/cookies', cookiesRouter, express.static(__dirname + '/public'))
indexRouter.use('/sessions', sessionsRouter, express.static(__dirname + '/public'))
indexRouter.use('/users', usersRouter, express.static(__dirname + '/public'))
indexRouter.use('/tickets', ticketsRouter, express.static(__dirname + '/public'))
indexRouter.use('/mockingproducts', mocksRouter, express.static(__dirname + '/public'))
indexRouter.use('/loggerTest', loggerRouter, express.static(__dirname + '/public'))

indexRouter.get('/', async (req, res) => {

    res.redirect('/products')
})

export default indexRouter