import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import { getCookie } from "./sessions";
import { categoriesRouter } from "./routes/categories";
import { productByRouter } from "./routes/products";
import { cartRouter } from "./routes/cart";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8000",
      "http://localhost:4000",
    ], // Update this to your frontend URL
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
app.use(categoriesRouter);
app.use(cartRouter)

app.get("/get-cookie", (req, res) => getCookie(req, res));

app.listen(8000, () => {
  console.log("listening at port 8000");
});
