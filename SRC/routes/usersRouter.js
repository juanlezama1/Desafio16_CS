import { Router } from "express"
import { userModel } from "../models/users.js"

// Devolverá el usuario en req.user, en caso de éxito.
const usersRouter = Router ()

usersRouter.get('/', async (req, res) => {
    const my_users = await userModel.find()
    res.status(200).send(my_users) // Todos los usuarios que tengo en mi DB
})

export default usersRouter