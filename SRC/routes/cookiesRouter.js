import { Router } from "express"

const cookiesRouter = Router ()

// Ruta ejemplo para leer las cookies sin firmar
cookiesRouter.get('/getCookies', (req, res) => {
    res.send(req.cookies)
})

// Ruta ejemplo para leer sólo las cookies firmadas
cookiesRouter.get('/getSignedCookies', (req, res) => {
    res.send(req.signedCookies)
})

// // Ruta ejemplo para configurar una cookie firmada
cookiesRouter.get('/setCookie', (req, res) => {
    res.cookie('MyCookie', 'Esto es una cookie', {maxAge: 6000000, signed: true}).send("Cookie creada!")
})

// Ruta ejemplo para borrar una cookie
cookiesRouter.get('/deleteCookie', (req, res) => {
    res.clearCookie('MyCookie').send("Cookie eliminada!")
})

export default cookiesRouter