import local from 'passport-local'
import { userModel } from "../../../models/users.js"
import {comparePSW, createHash} from '../../../utils/bcrypt.js'
import {logger} from '../../../utils/logger.js'

// Estrategia de autenticación (en este caso, local)
const localStrategy = local.Strategy

// Función para loguear al usuario. Devuelve un 401 con texto "Unauthorized" en caso de usuario/contraseña
// incorrecta o el usuario en caso de éxito 

const strategyLocalLogin = new localStrategy (
    {usernameField: 'email'}, async (email, password, done) => {

        try {
            const user = await userModel.findOne({email: email}).lean()
            if (user && (comparePSW(password, user.password)))

            {
                return done (null, user)
            }

            else {
                return done(null, false);
            }
        }
    
        catch (error)
    
        {
            return done(error)
        }}
)

// Estrategia local de registro
// La función de callback recibirá 4 parámetros: req (lo habilito desde passReqToCallback),
// el username (que en este caso le cambiamos el nombre a 'email' desde usernameField: 'email'), el password,
// y la función done que es para devolver el estado del logueo/registro. Esta función toma 2 valores. Primero el error, si hubo, y segundo 
// un estado que puede ser true/false de acorde a si hubo éxito en el login/registro. Se suele poner false y el valor del usuario logueado (equivalente a true)
// Si no hubo ningún problema, se suele poner 'null' en el error, indicando que no lo hubo. Simplemente se pudo/no se pudo loguear/registrar.
// Obtiene por el body el resto de los datos para registro.

const strategyLocalRegister = new localStrategy (
    {passReqToCallback: true, usernameField: 'email'}, async (req, email, password, done) => {
        
        try {
            // Solicito el resto de los valores, sacando username (email en este caso) y password
            const {first_name, last_name, age} = req.body
            const user = await userModel.findOne({email: email})
    
            if (user)
    
            // Si ya lo tenía cargado, devuelvo "true" con su código asociado
            {
                logger.warning("Intento de registro con correo ya cargado")
                return done(null, 'previously_registered')
            }

            // Caso contrario, lo creo y devuelvo "true" con su código correspondiente.
            else {
                const my_user = await userModel.create({first_name: first_name, last_name: last_name, age: age, email: email, password: createHash(password)}) 
                logger.info("Usuario registrado con éxito en la DB!")
                return done(null, 'registered')
            }
        }
    
        catch (error)

        {
            return done(error)
        }
    }
)

export {strategyLocalLogin, strategyLocalRegister}