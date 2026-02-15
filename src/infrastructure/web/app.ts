import "dotenv/config";
import express from "express";
import { BookController } from "../../adapter/controllers/bookController.js";
import { PrismaBookRepository } from "../../adapter/repositories/prismaBookRepository.js";
import { PrismaClient } from "@prisma/client";
import { UuidGenerator } from "../../adapter/utils/uuidGenerator.js";
import { AddBookUseCase } from "../../application/usecases/addBookUseCase.js";
import { FindBookByIdUseCase } from "../../application/usecases/findBookByIdUseCase.js";
import { bookRoutes } from "./routers/bookRouter.js";

const app = express();

app.use(express.json());

const prisma = new PrismaClient();
const uuidGenerator = new UuidGenerator();

const bookRepository = new PrismaBookRepository(prisma);
const addBookUseCase = new AddBookUseCase(bookRepository, uuidGenerator);
const findBookByIdUseCase = new FindBookByIdUseCase(bookRepository);
const bookController = new BookController(addBookUseCase, findBookByIdUseCase);
// const bookRouter = bookRouters(bookController);


app.use("/books", bookRoutes(bookController));
const PORT = process.env.PORT || 3000;



app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});