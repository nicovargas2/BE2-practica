import jwt from 'jsonwebtoken';
import envsConfig from '../config/envs.config.js';

//crear una funcion que reciba un payload y devuelva un token
export const createToken = (user) => {
    const { _id, email } = user;

    const payload = { _id, email };

    // el payload es la informacion que quiero guardar en el token
    // este tiene ya la variable de entorno SECRET
    // expiresIn es el tiempo de vida del token
    //return jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });

    const token = jwt.sign(payload, envsConfig.JWT_SECRET, { expiresIn: '1h' });
    //const token = jwt.sign(payload, envsConfig.JWT_SECRET, { expiresIn: '10m' });
    return token;
}

//crear una funcion que reciba un token y lo valide
export const verifyToken = (token) => {
    try {
        //return jwt.verify(token, process.env.SECRET);
        return jwt.verify(token, envsConfig.JWT_SECRET);
    } catch (error) {
        console.log(error);
        return null;
    }
}