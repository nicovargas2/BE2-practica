import bcrypt from 'bcrypt';

//Funcion asincronica que recibe un password y lo hashea
export const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

//Es igual al anterior pero con distinto metodo de hash, es sincronica
export const hashPasswordSync = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

//funcion que recibe un password y un hash y compare si el password es correcto
export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

export const comparePasswordSync = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}



