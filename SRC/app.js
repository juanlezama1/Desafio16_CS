import express from 'express'
import config_vars from './dotenv.js'
import mongoose from 'mongoose'
import __dirname from './path.js'
import { engine } from 'express-handlebars'
import indexRouter from '../SRC/routes/indexRouter.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initializatePassport from './config/passport/passport.js'
import {logger_middleware, logger} from './utils/logger.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

const my_app = express ()

const PORT = config_vars.port

// Conexión con DB
mongoose.connect(config_vars.mongo_db_url)
    .then(() => logger.info("Conectado a la DB!"))
    .catch(error => logger.fatal("Error al conectarse a la DB: ", error))

// Swagger

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentación de TP 16',
            description: 'Descripción de los EndPoints'
        }
    },
    apis: [`${__dirname}/docs/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)

// Middlewares
my_app.use(logger_middleware)
my_app.use(express.json())
my_app.use(cookieParser(config_vars.cookies_secret))
my_app.use(session({
    secret: config_vars.session_secret, 
    resave: true,
    store: MongoStore.create({
        mongoUrl: config_vars.mongo_db_url,
        ttl: 2*60*60 // 2 Horas
    }),
    saveUninitialized: true
}))
initializatePassport()
my_app.use(passport.initialize())
my_app.use(passport.session())

// Rutas
my_app.use('/API_docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
my_app.use('/', indexRouter)

// Implementación de Handlebars (motor de plantillas)
my_app.engine('handlebars', engine())
my_app.set('view engine', 'handlebars')
my_app.set('views', __dirname + '/views')

// Levanto el server
const my_server = my_app.listen(PORT, () => {
    logger.info(`Escuchando solicitudes en el puerto ${PORT} ...`)
})


// Aclaración: Ya dejé la DB cargada con 10 productos, 4 usuarios y 3 carritos de antemano
// Dejo comentado el código adjunto donde se cargaron los productos/carritos/usuarios para evitar que se carguen de nuevo