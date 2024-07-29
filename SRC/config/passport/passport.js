import passport from 'passport'
import strategyGitHub from './strategies/githubStrategy.js'
import strategyJWT from './strategies/jwtStrategy.js'
import {strategyLocalLogin, strategyLocalRegister} from './strategies/localStrategy.js'

// Función que INICIALIZA todas las estrategias de registro/login local. 
// Al correrse la función, las estrategias ya quedan activadas

const initializatePassport = () => {

// Función para inicializar la sesión del usuario. Sólo se accede si las estrategias de registro/autenticación
// vuelven con un usuario/valor lógico true. En caso de éxito, configura un req.user con el valor recibido desde la función 'done'

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser(async (user, done) => {
        done(null, user)
    })

// Estrategia de autenticación local (login)
    passport.use('login', strategyLocalLogin)
    
// Estrategia de autenticación local (register)
    passport.use('register', strategyLocalRegister)

// Estrategia de autenticación con GitHub
    passport.use('github', strategyGitHub)

// Estrategia de autentcación con JWT
    passport.use('jwt', strategyJWT)
}

export default initializatePassport