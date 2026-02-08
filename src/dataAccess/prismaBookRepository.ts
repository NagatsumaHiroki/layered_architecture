import { PrismaClient, type Book } from "../generated/prisma/client.js";
import type { BookRepositoryInterface } from "./bookRepositoryInterface.js";

export class PrismaBookRepository implements BookRepositoryInterface {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(title: string): Promise<Book> {
    return this.prisma.book.create({
      data: {
        title,
        isAvailable: true,
      },
    });
  }

  async findById(id: string): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: { id },
    });
  }

  async getBooks(): Promise<Book[]> {
    return this.prisma.book.findMany();
  }

  async updateBook(id: string, title: string): Promise<Book> {
    return this.prisma.book.update({
      where: { id },
      data: { title },
    });
  }
}