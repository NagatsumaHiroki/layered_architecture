import { PrismaClient, type Book } from "../generated/prisma/client.js";

export class PrismaBookRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createBook(title: string): Promise<Book> {
    return this.prisma.book.create({
      data: {
        title,
        isAvailable: true,
      },
    });
  }

  async getBookById(id: string): Promise<Book | null> {
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