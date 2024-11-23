import express, { Request, Response } from "express";
import {
  getAllProducts,
  productById,
  productsByCategory,
  productsByTags,
} from "../logic/products";

const productByRouter = express.Router();

productByRouter.get("/products", (req, res) => getAllProducts(req, res));
productByRouter.get("/products-by-category", (req, res) =>
  productsByCategory(req, res)
);
productByRouter.get(
  "/products-by-tags",
  (req: Request<{}, {}, {}, { tags: string }>, res) => productsByTags(req, res)
);
productByRouter.get(
  "/product-by-id",
  async (req: Request<{}, {}, {}, { id: string }>, res) => productById(req, res)
);

export { productByRouter };
