import { Router } from "express";
import { userDao } from "../dao/mongo/user.dao.js";
import { hashPasswordSync } from "../utils/hashPassword.js";
import { comparePasswordSync } from "../utils/hashPassword.js";
import passport from 'passport';
import { createToken, verifyToken } from "../utils/jwt.js";
import { passportCall } from "../middlewares/passportCall.middleware.js";
import { authorization } from "../middlewares/authorization.middleware.js";
import { UserDto } from "../dto/user.dto.js";

const router = Router();

router.post("/register", passport.authenticate('register'), async (req, res) => {
  try {
    /*
    Esto es lo que habiamos usado hasta la clase 2, sin passport. Ahora lo sacamos y lo reemplazamos por passport
    const userData = req.body;
    const findUser = await userDao.getByEmail(userData.email);
    if (findUser) return res.status(400).json({ status: "error", msg: "El usuario con el email ya existe" });

    const newUser = {
      ...userData,
      password: hashPasswordSync(userData.password)
    }
    const user = await userDao.create(newUser);
    res.status(201).json({ status: "success", payload: user });
    */

    // Ahora usamos passport
    // lo metemos como middleware arriba, luego del nombre de la API "/register"
    res.status(201).json({ status: "success", payload: "Usuario registrado" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }

})

/*
este endpoint es para que passport haga la autenticacion con la estrategia register
usando el middleware passportCall que creamos
*/
router.post("/registerPassportCall", passportCall('register'), async (req, res) => {
  try {
    res.status(201).json({ status: "success", payload: "Usuario registrado" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
})


router.post("/login", passport.authenticate("login"), async (req, res) => {
  try {
    /*const { email, password } = req.body;
    const user = await userDao.getByEmail(email);

    const checkPass = comparePasswordSync(password, user.password)
    // console.log(checkPass);

    if (!user || !checkPass)
      return res.status(401).json({ status: "error", msg: "Email o password no válido" });

    // Guardamos la información del usuario en la session
    req.session.user = {
      email,
      role: "user"
    }

    res.status(200).json({ status: "success", payload: user })
    */

    // Ahora usamos passport, y metemos el middleware de login
    req.session.user = {
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      role: "user"
    }

    const token = createToken(req.user);
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ status: "success", payload: req.session.user, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
})

/*
este endpoint es para que passport haga la autenticacion con la estrategia login
usando el middleware passportCall que creamos
*/
router.post("/loginPassportCall", passportCall("login"), async (req, res) => {
  try {

    /* esto provoca un error al usar el middleware que valida el role,
    asi que lo comentamos y lo agrego en el payload de la respuesta
    req.session.user = {
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      role: "user"
    }*/

    const token = createToken(req.user);
    res.cookie("token", token, { httpOnly: true });

    const user = new UserDto(req.user);
    res.status(200).json({ status: "success", payload: user, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
})


router.get("/profile", async (req, res) => {

  try {

    if (!req.session.user) return res.status(404).json({ status: "error", msg: "Usuario no logueado" });

    if (req.session.user.role !== "user") return res.status(403).json({ status: "error", msg: "Usuario no autorizado" });

    res.status(200).json({ status: "success", payload: req.session.user })

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }

})

router.get("/logout", async (req, res) => {

  try {

    req.session.destroy();

    res.status(200).json({ status: "success", payload: "Session cerrada" })

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }

})

router.put("/update-password", async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;
    const user = await userDao.getByEmail(email);

    if (!user) return res.status(404).json({ status: "error", msg: "Usuario no encontrado" });

    const checkPass = comparePasswordSync(password, user.password)

    if (!checkPass) {
      await userDao.update(user._id, hashPasswordSync(newPassword));

      res.status(200).json({ status: "success", payload: "Contraseña actualizada" })

      return res.status
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
})

router.put("/restore-password", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userDao.getByEmail(email);

    await userDao.update(user._id, { password: hashPasswordSync(password) });

    res.status(200).json({ status: "success", payload: "Contraseña actualizada" })

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
})

// Ruta de google
router.get("/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
    session: false
  }),
  async (req, res) => {
    return res.status(200).json({ status: "success", session: req.user });
  });

router.get("/current", async (req, res) => {
  // Obtenemos el token del header de la petición
  // const token = req.headers.authorization.split(' ')[1];

  // Obtenemos el token de las cookies
  const token = req.cookies.token;

  // si tenemos un error, podemos ver el token que se está enviando
  // console.log(token);

  // Verificamos si el token es válido
  const validToken = verifyToken(token);

  /*
  se ejecutará el bloque return, enviando una respuesta con un estado HTTP 401 (Unauthorized) 
  y un mensaje de error indicando que el token no es válido. Esto detiene la ejecución del 
  código y evita que se realicen operaciones adicionales con un token no válido.
  */
  if (!validToken) return res.status(401).json({ status: "error", msg: "Token no válido" });

  const user = await userDao.getByEmail(validToken.email);

  return res.status(200).json({ status: "ok", payload: user });
});

// el beneficio de este endpoint es que queda mas limpio el codigo,
// y el resto lo manejamos dentro de la estrategia jwt

//este encabezado dice que use como middleware la autenticacion con jwt
router.get("/current2", passport.authenticate("jwt"), async (req, res) => {
  return res.status(200).json({ status: "ok", user: req.user });
});

//aca usamos el middleware que creamos passportCall
router.get("/current3", passportCall("jwt"), authorization("admin"), async (req, res) => {
  const user = new UserDto(req.user);

  return res.status(200).json({ status: "ok", user });
});

export default router;