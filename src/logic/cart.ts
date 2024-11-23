import express, { Request, Response } from "express";
import { MongoDbClient } from "../mongodbclient";
import { Cart, CartItem } from "../types";


export const getCart = async (req: Request, res: Response) => {
  const userSession = req.cookies.userId;

  const client = await MongoDbClient.getClient();
  const response = await client
    .db("ecomm_db")
    .collection("cart")
    .findOne<Cart>({ userId: userSession });

  res.send(response);
};

export const addToCart = async (
  req: Request<{}, {}, { productId: number; quantity: number }>,
  res: Response
) => {
  const client = await MongoDbClient.getClient();
  const userId = req.cookies.userId;

  const productId = req.body.productId;
  const quantity = req.body.quantity;

  const cart = await client
    .db("ecomm_db")
    .collection("cart")
    .findOne({ userId });

  if (!cart) {
    // No cart exists, create a new one with the initial item
    await client
      .db("ecomm_db")
      .collection("cart")
      .insertOne({
        userId,
        items: [{ productId: productId, quantity }],
      });
  } else {
    // Cart exists, check if the item is already in the cart
    const existingItem = cart.items.find(
      (item: CartItem) => item.productId === productId
    );

    if (existingItem) {
      // Update the quantity of the existing item
      await client
        .db("ecomm_db")
        .collection("cart")
        .updateOne(
          { userId, "items.productId": productId },
          { $inc: { "items.$.quantity": quantity } }
        );

      const updatedCart = await client
        .db("ecomm_db")
        .collection("cart")
        .findOne({ userId, "items.productId": productId });

      //remove items below 0
      if (updatedCart) {
        const updatedCarItems = updatedCart.items;
        console.log("updatedCarItems", updatedCarItems);
        const removedEmptyItems = updatedCarItems.filter(
          (product: CartItem) => product.quantity > 0
        );

        await client
          .db("ecomm_db")
          .collection("cart")
          .updateOne(
            { userId },
            //@ts-ignore
            { $set: { items: removedEmptyItems } }
          );
      }

      console.log(updatedCart);
    } else {
      // Add the new item to the cart
      await client
        .db("ecomm_db")
        .collection("cart")
        .updateOne(
          { userId },
          //@ts-ignore
          { $push: { items: { productId: productId, quantity } } }
        );
    }
  }

  res.send(true);
};

export const emptyCart = async (req: Request, res: Response) => {
  const client = await MongoDbClient.getClient();
  const userId = req.cookies.userId;

  const deleted = await client
    .db("ecomm_db")
    .collection("cart")
    .deleteOne({ userId });
  res.send(deleted);
};

