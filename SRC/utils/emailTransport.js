import nodemailer from 'nodemailer'
import config_vars from '../dotenv.js'

const email_transport = nodemailer.createTransport({
    service: 'gmail',
    port: config_vars.email_port,
    auth: {
        user: config_vars.email_user,
        pass: config_vars.email_password
    }
})

export default email_transport