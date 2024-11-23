import express from "express";
import { addToCart, emptyCart, getCart } from "../logic/cart";

const cartRouter = express.Router();


cartRouter.get("/get-cart", (req, res) => getCart(req, res));
cartRouter.post("/add-to-cart", (req, res) => addToCart(req, res));
cartRouter.get("/delete-cart", (req, res) => emptyCart(req, res));

export { cartRouter };
