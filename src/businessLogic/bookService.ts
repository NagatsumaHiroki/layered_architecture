import type { Book } from "../generated/prisma/client.js";
import type { BookRepositoryInterface } from "../dataAccess/bookRepositoryInterface.js";
import type { BookServiceInterface } from "./bookServiceInterface.js";

export class BookService implements BookServiceInterface {
 constructor(private readonly bookRepository: BookRepositoryInterface) {}

 async add(title:string):Promise<Book> {
  return await this.bookRepository.create(title);
 }
 async findById(id:string):Promise<Book | null> {
  return await this.bookRepository.findById(id);
 }
}