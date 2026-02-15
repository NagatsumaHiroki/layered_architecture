import type { Request, Response } from "express";
import type { AddBookUseCaseInterface } from "../../appplication/usecases/addBookUseCaseInrerface.js";
import type { AddBookRequestDto } from "../../appplication/usecases/dtos/book/AddBookRequestDto.js";
import type { FindBookByIdUseCaseInterface } from "../../appplication/usecases/findBookByIdUseCaseInterface.js";

export class BookController {
    constructor(
        private readonly addBookUseCase: AddBookUseCaseInterface,
        private readonly findBookByIdUseCase: FindBookByIdUseCaseInterface
    ) {}
    async add(req: Request, res: Response): Promise<void> {
        try {
            if (typeof req.body?.title !== "string" || req.body.title.trim() === "") {
                res.status(400).json({ error: "title is required" });
                return;
            }

            const requestDto : AddBookRequestDto = {
                title: req.body.title.trim(),
            };
            const book = await this.addBookUseCase.execute(requestDto);
            res.status(201).json(book);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to add book" });
        }
    }
    async findById(req: Request, res: Response): Promise<void> {
        try {
            const rawId = req.params.id;
            if (typeof rawId !== "string" || rawId.trim() === "") {
                res.status(400).json({ error: "id is required" });
                return;
            }
            const id = rawId.trim();

            const book = await this.findBookByIdUseCase.execute({ id });
            if (!book) {
                res.status(404).json({ error: "Book not found" });
                return;
            }

            res.status(200).json(book);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to find book" });
        }
    }
}