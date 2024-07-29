import jwt from 'jsonwebtoken'
import config_vars from '../dotenv.js'

// Función que recibe a un objeto usuario, y devuelve un Token encriptado con la
// contraseña indicada, y que expira en el tiempo indicado

const generateToken = (user) => {

    const privateKey = config_vars.jwt_secret
    const expiracyTime = '12h'

    // Recibe: El contenido que recibirá el token, en nuestro caso un usuario, la clave privada y el tiempo de expiración
    const token = jwt.sign({user}, privateKey, {expiresIn: expiracyTime})
    return token // Devuelve un TOKEN encriptado, que dura 12 horas. 
}

const generateURLToken = (email) => {

    // Contenido del token (un objeto con sólo el email que blanqueará su password)
    const token_content = {email}

    // El tiempo de expiración del token (1 HORA)
    const URL_expiracyTime = '1h'

    // La clave secreta del token
    const URL_private_key = config_vars.URL_jwt_secret

    // Genero el Token con su firma
    const URL_token = jwt.sign(token_content, URL_private_key, {expiresIn: URL_expiracyTime})

    return URL_token
}

export {generateToken, generateURLToken}