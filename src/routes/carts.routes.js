import { Router } from "express";
import { cartsController } from "../controllers/carts.controller.js";


const router = Router();

// revisar este, porque quizas no se usa, los carritos se deben crear automaticamente
//router.post("/", cartsController.create);

router.get("/:cid", cartsController.getById);

router.post("/:cid/product/:pid", cartsController.addProductToCart);

router.delete("/:cid/product/:pid", cartsController.deleteProductToCart);

router.put("/:cid/product/:pid", cartsController.updateQuantityProductInCart);

router.delete("/:cid", cartsController.clearProductsToCart);

export default router;
