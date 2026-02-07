import "dotenv/config";
import express from "express";
import { BookController } from "./presentation/bookController.js";

const app = express();

app.use(express.json());

const bookController = new BookController();

const PORT = process.env.PORT || 3000;

app.post("/books", bookController.add.bind(bookController));
app.get("/books/:id", bookController.findById.bind(bookController));
app.get("/books", bookController.findAll.bind(bookController));

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});