import { Router } from "express";
import { cartsController } from "../controllers/carts.controller.js";
import { passportCall } from "../middlewares/passportCall.middleware.js";
import { authorization } from "../middlewares/authorization.middleware.js";

const router = Router();

// este endpoint no se usa, los carritos se deben crear automaticamente
//router.post("/", cartsController.create);

router.get("/:cid", cartsController.getById);

router.post("/:cid/product/:pid", passportCall("jwt"), authorization("user"), cartsController.addProductToCart);

router.delete("/:cid/product/:pid", passportCall("jwt"), authorization("user"), cartsController.deleteProductToCart);

router.put("/:cid/product/:pid", passportCall("jwt"), authorization("user"), cartsController.updateQuantityProductInCart);

router.delete("/:cid", passportCall("jwt"), authorization("user"), cartsController.clearProductsToCart);

// Agrego router para las compras
router.post("/:cid/purchase", passportCall("jwt"), authorization("user"), cartsController.purchase);


export default router;
