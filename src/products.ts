import { Request, Response } from "express";
import { MongoDbClient } from "./mongodbclient";

export const productsByCategory = async (req: Request, res: Response) => {
  const category = req.query.category;
  const client = await MongoDbClient.getClient();
  const cursor = await client
    .db("ecomm_db")
    .collection("products")
    .find({
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
    .find({
      tags: {
        $exists: true,
        $in: [...tags],
      },
    });

  const products = await cursor.toArray();
  res.send(products);
};