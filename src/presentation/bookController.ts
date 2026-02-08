import type { Request, Response } from "express";
import { BookService } from "../businessLogic/bookService.js";
import type { BookServiceInterface } from "../businessLogic/bookServiceInterface.js";

export class BookController {
    
    constructor(private readonly bookService: BookServiceInterface) {}
    async add(req: Request, res: Response): Promise<void> {
        try {
            const { title } = req.body as { title?: string };
            if (!title) {
                res.status(400).json({ error: "Title is required" });
                return;
            }
            const book = await this.bookService.add(title);
            res.status(201).json(book);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to add book" });
        }
    }
    async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const book = await this.bookService.findById(id);
            if (book) {
                res.status(200).json(book);
            } else{
                res.status(404).json({ error: "Book not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to find book" });
        }
    }
}