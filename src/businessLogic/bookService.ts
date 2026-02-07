import { PrismaBookRepository } from "../dataAccess/prismaBookRepository.js";
import type { Book } from "../generated/prisma/client.js";

export class BookService {
 private readonly bookRepository: PrismaBookRepository;
 constructor() {
  this.bookRepository = new PrismaBookRepository();
 }

 async add(title:string):Promise<Book> {
  return await this.bookRepository.createBook(title);
 }
 async findById(id:string):Promise<Book | null> {
  return await this.bookRepository.getBookById(id);
 }
 async findAll():Promise<Book[]> {
  return await this.bookRepository.getBooks();
 }
}