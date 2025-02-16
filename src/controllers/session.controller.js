import { createToken, verifyToken } from "../utils/jwt.js";
import { UserDto } from "../dto/user.dto.js";
import { userDao } from "../dao/mongo/user.dao.js";
import { hashPasswordSync } from "../utils/hashPassword.js";
import { comparePasswordSync } from "../utils/hashPassword.js";

export class SessionController {

    async loginPassportCall(req, res) {
        try {
            const token = createToken(req.user);
            res.cookie("token", token, { httpOnly: true });

            const user = new UserDto(req.user);
            res.status(200).json({ status: "success", payload: user, token });

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
        }
    };

    async currentUser(req, res) {
        const user = new UserDto(req.user);
        return res.status(200).json({ status: "ok", user });
    };

    async registerPassportCall(req, res) {
        try {
            res.status(201).json({ status: "success", payload: "Usuario registrado" });

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
        }
    };

    async restorePassword(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userDao.getByEmail(email);

            await userDao.update(user._id, { password: hashPasswordSync(password) });

            res.status(200).json({ status: "success", payload: "Contraseña actualizada" })

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
        }
    };

    async updatePassword(req, res) {
        try {
            const { email, password, newPassword } = req.body;
            const user = await userDao.getByEmail(email);
            if (!user) return res.status(404).json({ status: "error", msg: "Usuario no encontrado" });

            const checkPass = comparePasswordSync(password, user.password)

            if (checkPass) {
                console.log(await userDao.update(user._id, { password: hashPasswordSync(newPassword) }));

                res.status(200).json({ status: "success", payload: "Contraseña actualizada" })

                return res.status
            } else {
                return res.status(401).json({ status: "error", msg: "Contraseña incorrecta" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
        }
    };
};

export const sessionController = new SessionController();