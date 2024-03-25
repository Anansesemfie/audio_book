import { Router, Request, Response } from "express";
import { PORT } from "../../utils/env";
import { CHECKAPPTOKEN } from "../middlewares/CheckApp";

import User from "./UserRoute";
import Book from "./bookRoute";
import Chapter from "./chapterRoute";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Welcome to Anansesemfie",
    endpoints: {
      staging: `http://localhost:${PORT}/`,
      production: "coming soon....",
    },
    version: "1.0",
  });
});

router.use("/user", CHECKAPPTOKEN, User);
router.use("/books", CHECKAPPTOKEN, Book);
router.use("/books/chapter", CHECKAPPTOKEN, Chapter);

export default router;