import bcrypt from 'bcrypt'
import config_vars from '../dotenv.js'

const hash_cost = parseInt(config_vars.hash_cost) // Variable que determina la 'cantidad de rondas de encriptación' que sufrirá la pass

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(hash_cost))
}

const comparePSW = (psw_preHash, psw_postHash) => {
    return bcrypt.compareSync(psw_preHash, psw_postHash)
} 

export {createHash, comparePSW}
