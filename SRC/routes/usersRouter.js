import { Router } from "express"
import { userModel } from "../models/users.js"

// Devolverá el usuario en req.user, en caso de éxito.
const usersRouter = Router ()

usersRouter.get('/', async (req, res) => {

    try {
        const my_users = await userModel.find()
        res.status(200).send(my_users) // Todos los usuarios que tengo en mi DB
    }

    catch (error)

    {
        res.status(500).send("Error al obtener los usuarios de la base de datos")
    }
})

export default usersRouter