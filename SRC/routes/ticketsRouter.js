import { Router } from "express"
import {readTickets} from "../controllers/ticketController.js"

const ticketsRouter = Router ()

// LECTURA DE TODAS LAS ÓRDENES DE COMPRA
ticketsRouter.get('/', async (req, res) => {

    try {
        const tickets = await readTickets()
        res.status(200).send(tickets)
    }

    catch (error)
 
    {
        res.status(500).send("Error al leer las órdenes de compra: ", error)
    }
})

export default ticketsRouter