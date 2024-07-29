import { ticketModel } from "../models/tickets.js"

const readTickets = async(product_code) => {
    const my_tickets = await ticketModel.find().lean()
    return my_tickets
}

const createTicket = async(total_amount, cartID, userID) => {
    const my_ticket =  {
        amount: total_amount,
        cart: cartID,
        user: userID
    }

    let ticket = await ticketModel.create(my_ticket)
    return ticket
}

export {readTickets, createTicket}
