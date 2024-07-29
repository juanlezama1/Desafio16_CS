import { Router } from "express"
import passport from "passport"
import sendResetPSWEmail from "../controllers/sessionController.js"
import jwt from 'jsonwebtoken'
import config_vars from "../dotenv.js"
import { getUserByEmail, getUserIdByEmail, updateUserPSW } from "../controllers/userController.js"
import { comparePSW, createHash } from "../utils/bcrypt.js"

// Devolverá el usuario en req.user, en caso de éxito.
const sessionsRouter = Router ()

// Ruta para cargar una sesión activa en caso de login exitoso.
// Primero se ejecuta una función middleware (passport.authenticate) y luego se ejecuta la función callback que
// trabaja en base a lo que previamente procesó el middleware. Sólo entra al callback si se logueó con éxito!

sessionsRouter.post('/login', passport.authenticate('login'), async (req, res) => {

    // Sólo entra a este callback si el logueo fue exitoso, caso contrario dirá "Unauthorized" con código 401
    // Si es exitoso, req.user tendrá al usuario que se logueó.
    // Finalmente, el usuario quedará alojado en req.session.user

    try {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }

        // Si llegó a esta altura, se logueó correctamente, lo envío a la página principal
        res.redirect('/')
    }

    catch (error)

    {
        res.status(500).send("Error al loguear usuario")
    }
})

// Ruta para registrar un usuario.
// Sólo accede a la función de callback si regresa con éxito desde el middleware (con un done que devolvió true)
// En mi caso, vuelve siempre, y req.user valdrá 'previosly_registered' ó 'registered' según sea el caso

sessionsRouter.post('/register', passport.authenticate('register'), async (req, res) => {
    try {
        if (req.user === 'previously_registered')
        {
            return res.status(401).send("Usuario ya existente en la aplicación")
        }

        else 
        {
            res.status(200).send("Usuario creado correctamente")
        }
    }

    catch (error)

    {
        res.status(500).send("Error al registrar usuario")
    }
})

// Ruta para registro de un usuario por GET (visual)
sessionsRouter.get('/register', async (req, res) => {
    
    res.status(200).render('templates/user_registration')
})

// Ruta para registro de un usuario por GET (visual)
sessionsRouter.get('/login', async (req, res) => {

    res.status(200).render('templates/user_login')
})

// Ruta para eliminar una sesión activa
sessionsRouter.get('/logout', async (req, res) => {
    try {
        req.session.destroy()

        // Usuario finalizó su sesión, lo envío a la página principal
        res.redirect('/')
    }

    catch (error)

    {
        res.status(500).send("Error al finalizar sesión!")
    }
})

// Ruta para autenticarme a través de GitHub. 
sessionsRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {})

// Ruta de callback, una vez autenticado a través de GitHub
sessionsRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {

    // Ahora tengo los datos de mi usuario guardados en req.session.passport.user
    // Igualmente los guardaré en req.session.user

    try {
        req.session.user = {
            email: req.user.email,
            name: req.user.first_name 
        }

        // Cliente autenticado con éxito, lo envío a la página principal
        res.redirect('/')
    }

    catch (error)

    {
        res.status(500).send("Error al loguear usuario con GitHub")
    }
}) 

// Ruta para autenticarme a través de JWT
// El parámetro session:false sirve para indicar que NO se cree una sesión de usuario
// en el servidor/DB ya que, justamente, se utiliza JWT para este fin

// Pasos:
// 1) ENTRO POR GET
// 2) ACCEDO AL MÉTODO DE AUTENTICACIÓN POR PASSPORT
// 3) EXTRAIGO LA COOKIE jwtCookie (encriptada y firmada con una contraseña en particular)
// 4) SI LA COOKIE ES JWT Y ESTÁ FIRMADA CON LA CONTRASEÑA, VEO EL CONTENIDO DE LA COOKIE
// 5) CORRESPONDE A UN USUARIO, SACO SU ID
// 6) LO BUSCO EN LA DB CON ESE ID, Y SI EXISTE, LO DEVUELVO
// 7) Y, SI LO DEVOLVÍ, IMPRIMO EL CÓDIGO EN PANTALLA Y MANDO UN STATUS 200 CON EL USUARIO EN CUESTIÓN

sessionsRouter.get('/testJWT', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.status(200).send(req.user)
})

sessionsRouter.get('/current', async (req, res) => {
    res.status(200).send(req.session.user)

})

sessionsRouter.post('/resetPSW', async (req, res) => {

    const {email} = req.body

    try {
        await getUserIdByEmail(email)
        await sendResetPSWEmail (email)
        res.status(200).send("Correo de recuperación enviado correctamente!")
    }

    catch (error)

    {
        req.logger.error("Usuario no  enviar el correo de recuperación - Usuario no existente!")
        res.status(400).send("Error al enviar el correo de recuperación - Usuario no existente!")
    }
})


// Entrás por GET cuando apretás el link de recuperación en el email

sessionsRouter.get('/changePSW', async (req, res) => {

    // Token recibido
    const url_token = req.query.token

    // Verifico si el token es válido

    try {    
        jwt.verify(url_token, config_vars.URL_jwt_secret)
        res.status(200).send("(Formulario de cambio de contraseña con FrontEnd - Termina enviando por POST a /changePSW la nueva contraseña y el mismo token como parámetro)")
    }
    
    catch (error)

    {
        req.logger.warning("El token recibido fue modificado o expiró")
        res.status(400).send("URL Expirada!")
    }
})

sessionsRouter.post('/changePSW', async (req, res) => {

    // Token recibido
    const url_token = req.query.token

    let user_email
    let new_password
    
    // VERIFICA EL TOKEN, Y OBTIENE EMAIL Y NUEVA PASSWORD

    try {    
        const user_token = jwt.verify(url_token, config_vars.URL_jwt_secret)
        user_email = user_token.email
        new_password = req.body.new_password
    }
    
    catch (error)

    {
        req.logger.warning("El token recibido fue modificado o expiró")
        res.status(400).send("URL Expirada!")
    }

    // VERIFICA QUE LA NUEVA PASSWORD NO SEA IGUAL A LA ANTERIOR, Y LA ACTUALIZA. 
    // El getUserByEmail no debería fallar nunca porque ya se confirmó que el usuario existía

    const user = await getUserByEmail(user_email)
    
    if (comparePSW(new_password, user.password))
        res.status(400).send("La nueva contraseña no puede ser igual a la anterior")

    else

    {
        const encrypted_psw = createHash(new_password)
        await updateUserPSW (user_email, encrypted_psw)
        res.status(200).send("La contraseña se actualizó con éxito!")
    }
})

export default sessionsRouter