export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).json({ status: "error", msg: "Usuario no autorizado" });

        if (req.user.role !== role) return res.status(403).json({ status: "error", msg: "Rol no autorizado." });

        next();
    }
}