import passport from 'passport';
import local from 'passport-local';
import { userDao } from "../dao/mongo/user.dao.js";
import { hashPasswordSync, comparePasswordSync } from '../utils/hashPassword.js';
const LocalStrategy = local.Strategy;

//funcion global de estrategias
const initializedPassport = () => {
    //estrategia de registro local
    passport.use(
        'register',
        new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
            /*
            "register" es el nombre de la estrategia que estamos creando.
            passReqToCallback: true le dice a passport que pase el objeto de solicitud a la función de verificación, lo que nos permite acceder a los datos de la solicitud en la función de autenticacion.
            async (req, username, password, done) es la función de autenticación que se ejecutará cuando se llame a la estrategia.
            usernameField: "email" le dice a passport que el campo de nombre de usuario es el campo de correo electrónico.
            Nota: passport recibe dos datos el username y el password, en este caso el username es el email.
                En caso que no tengamos un campo username en nuestro formulario, podemos usar usernameField para definir el campo que usaremos como username.
            done es una función que se llama cuando la autenticación se completa. done toma tres argumentos: error, usuario y opciones.
            */
            try {
                const { first_name, last_name, age } = req.body;

                // verificamos si el usuario ya existe
                const user = await userDao.getByEmail(username);
                if (user) return done(null, false, { message: 'User already exists' });

                //creamos el usuario
                const newUser = {
                    email: username,
                    password: hashPasswordSync(password),
                    first_name,
                    last_name,
                    age
                }
                const createdUser = await userDao.create(newUser);
                return done(null, createdUser);

            } catch (error) {
                done(error)
            }
        }));

    // Serialización y deserialización de usuarios
    /* 
     La serialización y deserialización de usuarios es un proceso que nos permite almacenar y recuperar información del usuario en la sesión.
     La serialización es el proceso de convertir un objeto de usuario en un identificador único.
     La deserialización es el proceso de recuperar un objeto de usuario a partir de un identificador único.
     Los datos del user se almacenan en la sesión y se recuperan en cada petición.
     */


    // de donde toma el user? Bueno, el done de la funcion de autenticacion ya tiene el createdUser y se lo pasa a serializeUser para que lo serialice.
    // de ahi es que lo toma/recibe
    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    // de donde toma el id? Bueno, el serializeUser ya serializo el user y le paso el id a deserializeUser
    passport.deserializeUser(async (id, done) => {
        try {

            const user = await userDao.getById(id);
            done(null, user);

        } catch (error) {
            done(error)
        }
    })

    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            const user = await userDao.getByEmail(username);
            const checkPass = comparePasswordSync(password, user.password);

            if (!user || !checkPass) return done(null, false, { message: 'User or email invalid.' });

            return done(null, user);

        } catch (error) {
            done(error);
        }
    }));

};

export default initializedPassport;