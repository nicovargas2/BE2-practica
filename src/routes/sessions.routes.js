import { Router } from "express";
import { userDao } from "../dao/mongo/user.dao.js";
import { hashPasswordSync } from "../utils/hashPassword.js";
import { comparePasswordSync } from "../utils/hashPassword.js";
import passport from 'passport';
import { createToken } from "../utils/jwt.js";

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

    res.status(200).json({ status: "success", payload: req.session.user, token });

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


export default router;