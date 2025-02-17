import { Router } from "express";
import { ticketsController } from "../controllers/tickets.controller.js";
import { passportCall } from "../middlewares/passportCall.middleware.js";
import { authorization } from "../middlewares/authorization.middleware.js";

const router = Router();

router.get("/", passportCall("jwt"), authorization("admin"), ticketsController.getAll);

export default router;
