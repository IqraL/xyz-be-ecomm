import { Request, Response } from "express";

import { MongoDbClient } from "./mongodbclient";

export const getCategories = async (req: Request, res: Response) => {
  const client = await MongoDbClient.getClient();
  const cursor = await client.db("ecomm_db").collection("categories").find();
  const categories = await cursor.toArray();
  res.send(categories[0].categories);
};

export const getTagMap = async (req: Request, res: Response) => {
  const client = await MongoDbClient.getClient();
  let tags: any = {};
  for await (const category of categories) {
    const cursor = await client
      .db("ecomm_db")
      .collection("products")
      .find({
        category: {
          $exists: true,
          // $nin: ["groceries"],
          $in: [category],
        },
      });

    const a: any = await cursor.toArray();
    a.forEach((element: any) => {
      if (tags[category])
        tags = {
          ...tags,
          [category]: [...tags[category], ...element.tags],
        };
      else {
        tags = { ...tags, [category]: [...element.tags] };
      }
    });
  }

  let removeDuplicates = {};
  for await (const category of categories) {
    const d = new Set(tags[category]);
    removeDuplicates = { ...removeDuplicates, [category]: Array.from(d) };
  }
  res.send(removeDuplicates);
};

const categories = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
];