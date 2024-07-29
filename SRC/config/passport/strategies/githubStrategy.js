import GitHubStrategy from 'passport-github2'
import crypto from 'crypto'
import {createHash} from '../../../utils/bcrypt.js'
import { userModel } from '../../../models/users.js'
import { logger } from '../../../utils/logger.js'

// Estrategia para autenticar a un usuario a través de GitHub.
// Aclaración: Se solicita el email, pero es posible que el usuario no tenga su email
// configurado de manera pública. Para este trabajo se considera EL EMAIL ES PÚBLICO

const strategyGitHub = new GitHubStrategy({
    clientID: "Iv23liAMlvc8ItBq5qT5",
    clientSecret: "42807b3021eae3e7ad77f5adde3a0ed06292814f",
    callbackURL: "http://localhost:8080/sessions/githubSession",
    scope: ['user:email'] // Solicitud del email
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Caso que su email no sea público

        if (!profile._json.email)

        {
            logger.warning("Logueo con GitHub usando email en privado"),
            done(null, false)
        }

        else

        {
            // Caso que ya esté guardado el usuario
            const user = await userModel.findOne({email: profile._json.email}).lean()
            if (user) {
                logger.info("Cliente logueado con GitHub: previamente cargado")
                done(null, user)
            }

            // Caso que sea un usuario nuevo
            else {
                const randomString = crypto.randomBytes(10).toString('hex')

                let first_name = profile._json.name
                
                // Caso que el nombre esté vacío (por default viene vacío)
                !first_name && (first_name = profile._json.login)

                // La contraseña será la combinación del nombre(ó usuario) + caracteres aleatorios
                let password = createHash(first_name + randomString)

                const userCreated = await userModel.create({ first_name: first_name, last_name: ' ', email: profile._json.email, age: 18, password: password})
                logger.info("Cliente logueado con GitHub: primer login, cargado en DB")
                done(null, userCreated)
            }
        }
    } catch (error) {
        return done(error)
    }
})

export default strategyGitHub