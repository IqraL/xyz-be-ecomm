import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import { getCookie } from "./sessions";
import { getCategories, getTagMap } from "./categories";
import { productById, productByRouter, productsByCategory, productsByTags } from "./products";
import { Product } from "./types";
import { MongoDbClient } from "./mongodbclient";

const app = express();

app.use(
  cors({
    origin: process.env.frontend_uri, // Update this to your frontend URL
    credentials: true, // Allow cookies to be sent and received
  })
);

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get("/ping", async (req, res) => {
  res.send("pong");
});


app.use(productByRouter);

app.get("/get-cookie", (req, res) => getCookie(req, res));
app.get("/categories", (req, res) => getCategories(req, res));
app.get("/tags-map", (req, res) => getTagMap(req, res));




app.listen(8000, () => {
  console.log("listening at port 8000");
});
