import { userModel } from "../models/users.js"

const getUserName = async (req) => {

    if (req.session.user.email)

    {
        const my_user = await userModel.findOne({email: req.session.user.email})
        return my_user.first_name
    }
}

const getUserStatus = async (req) => {

    if (req.session.user.email)

    {
        const my_user = await userModel.findOne({email: req.session.user.email})
        if(my_user.category == "Admin"){
            return true
        }
        else {
            return false
        }
    }
}

const getUserIdByEmail = async (email) => {
    const user_id = await userModel.findOne({email})
    return user_id._id
}

const getUserByEmail = async (email) => {
    const my_user = await userModel.findOne({email})
    return my_user
}

const updateUserPSW = async (email, new_password) => {
    await userModel.findOneAndUpdate({email}, {password: new_password})
}

export {getUserName, getUserStatus, getUserIdByEmail, getUserByEmail, updateUserPSW}
