import email_transport from '../utils/emailTransport.js'
import {readFileSync} from 'fs'
import __dirname from '../path.js'
import config_vars from '../dotenv.js'
import { generateURLToken } from '../utils/jwt.js'

const sendResetPSWEmail = async (email) => {

    const PORT = config_vars.port

    // Leo el template del HTML Base
    const original_html = readFileSync(__dirname + '/public/html/resetPSW.html', 'utf-8')

    // Genero el token para este usuario
    const user_token = generateURLToken(email)

    // Reemplazo en el template el link para este usuario en particular
    const changePswLink = `http://localhost:${PORT}/sessions/changePSW?token=${user_token}`
    const my_html = original_html.replace("LINK_AL_USUARIO", changePswLink)

    // Mando el email
    await email_transport.sendMail({
        from: 'TP CoderHouse <juanpablodeveloper92@gmail.com>',
        to: email,
        subject: 'Recuperación de Contraseña',
        html: my_html,
        attachments: [
    
            {
                filename: 'facebook.png',
                path: __dirname + '/public/img/emails/facebook.png',
                cid: 'facebook'},
        
            {
                filename: 'twitter.png',
                path: __dirname + '/public/img/emails/twitter.png',
                cid: 'twitter'},
        
            {
                filename: 'linkedin.png',
                path: __dirname + '/public/img/emails/linkedin.png',
                cid: 'linkedin'},
        
            {
                filename: 'instagram.png',
                path: __dirname + '/public/img/emails/instagram.png',
                cid: 'instagram'},
        
            {
                filename: 'password.png',
                path: __dirname + '/public/img/emails/password.png',
                cid: 'password'},
        
            {
                filename: 'coderhouse.png',
                path: __dirname + '/public/img/emails/coderhouse.png',
                cid: 'coderhouse'},
        ]
    })
}

export default sendResetPSWEmail