import { PrismaClient } from "@prisma/client";
import { Book } from "../../domain/entities/book.js";
import type { BookRepositoryInterface } from "../../domain/entities/repositories/bookRepositoryInterface.js";

export class PrismaBookRepository implements BookRepositoryInterface {
constructor(private readonly prisma: PrismaClient) {
}

  async create(book: Book): Promise<Book> {
    const createdBook = await this.prisma.book.create({
      data: {
        id: book.id,
        title: book.title,
        isAvailable: book.isAvailable,
        createAt: book.createAt,
        updatedAt: book.updatedAt,
      },
    });

    return new Book(
      createdBook.id, 
      createdBook.title,
      createdBook.isAvailable, 
      createdBook.createAt, 
      createdBook.updatedAt
    );
    
  }

  async findById(id: string): Promise<Book | null> {
    const foundBook = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!foundBook) {
      return null;
    }

    return new Book(
      foundBook.id,
      foundBook.title,
      foundBook.isAvailable,
      foundBook.createAt,
      foundBook.updatedAt
    );
  }

  // async getBooks(): Promise<Book[]> {
  //   return this.prisma.book.findMany();
  // }

  // async updateBook(id: string, title: string): Promise<Book> {
  //   return this.prisma.book.update({
  //     where: { id },
  //     data: { title },
  //   });
  // }
}