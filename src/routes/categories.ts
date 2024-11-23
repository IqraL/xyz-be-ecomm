import express from "express";
import { getCategories, getTagMap } from "../logic/categories";
const categoriesRouter = express.Router();


categoriesRouter.get("/categories", (req, res) => getCategories(req, res));
categoriesRouter.get("/tags-map", (req, res) => getTagMap(req, res));

export { categoriesRouter };