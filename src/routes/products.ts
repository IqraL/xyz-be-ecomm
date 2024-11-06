import express, { Request, Response } from "express";
import { MongoDbClient } from "../mongodbclient";
import { Product } from "../types";
const productByRouter = express.Router();


export const getAllProducts = async (req: Request, res: Response) => {
    const client = await MongoDbClient.getClient();
    const cursor = await client
      .db("ecomm_db")
      .collection("products")
      .find<Product>({});

      const products = await cursor.toArray();
    res.send(products);
}

export const productsByCategory = async (req: Request, res: Response) => {
  const category = req.query.category;
  const client = await MongoDbClient.getClient();
  const cursor = await client
    .db("ecomm_db")
    .collection("products")
    .find<Product>({
      category: {
        $exists: true,
        $in: [category],
      },
    });

  const products = await cursor.toArray();
  res.send(products);
};


export const productsByTags = async (
  req: Request<{}, {}, {}, { tags: string }>,
  res: Response
) => {
  const tags = req.query.tags.split(",");
  const client = await MongoDbClient.getClient();
  const cursor = await client
    .db("ecomm_db")
    .collection("products")
    .find<Product>({
      tags: {
        $exists: true,
        $in: [...tags],
      },
    });

  const products = await cursor.toArray();
  res.send(products);
};

export const productById = async (
  req: Request<{}, {}, {}, { id: string }>,
  res: Response
) => {
  const id = req.query.id;

  const client = await MongoDbClient.getClient();
  const product = await client
    .db("ecomm_db")
    .collection("products")
    .findOne<Product>({ id: Number(id) });

  res.send(product);
};


productByRouter.get("/products", (req, res) =>
  getAllProducts(req, res)
);
;
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