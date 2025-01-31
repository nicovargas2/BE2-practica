import passport from "passport";

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        // passport.authenticate(strategy, { session: false }, (error, user, info) => {
        passport.authenticate(strategy, (error, user, info) => {
            if (error) {
                return res.status(500).json({ status: "error", msg: "Error interno del servidor" });
            }

            if (!user) {
                return res.status(401).json({ status: "error", message: info.message ? info.message : info.message.toString() });
            }

            req.user = user;
            next();

        })(req, res, next);
    }
}