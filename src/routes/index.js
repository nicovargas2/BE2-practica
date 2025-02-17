import { Router } from "express";
import productsRouter from "./products.routes.js";
import cartsRouter from "./carts.routes.js";
import sessionsRouter from "./sessions.routes.js"
import ticketsRouter from "./tickets.routes.js";

const router = Router();

router.use("/tickets", ticketsRouter);
router.use("/products", productsRouter);
router.use("/carts", cartsRouter);
router.use("/session", sessionsRouter);


export default router;
