import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import {userModel} from '../../../models/users.js'
import config_vars from "../../../dotenv.js";

const cookieExtractor = req => {
    // Busca si tengo cookies en la solicitud HTTP, y si tengo, token tomará el valor de la cookie
    // llamada "jwtCookie". 
     
    const token = req.cookies? req.cookies.jwtCookie : {}
    return token
}

const jwtOptions = {
    // Cuando el cliente mande el Token JWT (son los datos de un usuario encriptados en formato JWT Y FIRMADOS con una contraseña en particular) lo hará en el Header usando una palabra reservada
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Anulada por ahora ya que no usaré un browser, sino PostMan
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    // Clave para comparar si las cookies que fueron enviadas están firmadas con esta contraseña
    secretOrKey: config_vars.jwt_secret
}

// Payload tendrá toda la información decodificada del token
// En nuestro caso, corresponde a la información del usuario

const strategyJWT = new JwtStrategy (jwtOptions, async (payload, done) => {
    try {
        // Busco un usuario en la DB con el mismo ID. Si existe, lo devuelvo
        const user = await userModel.findById(payload.user._id)
        if (!user)
            {
                return done(null, false)
            }
        
        return done (null, user)
    }

    catch (error)

    {
        done(error, null)
    }
})

export default strategyJWT