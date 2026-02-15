import { Book } from "../domain/entities/book.js";
import type { BookRepositoryInterface } from "../domain/entities/repostirories/bookRepositoryInterface.js";
import type { BookServiceInterface } from "./bookServiceInterface.js";

export class BookService implements BookServiceInterface {
 constructor(private readonly bookRepository: BookRepositoryInterface) {}

 async add(title:string):Promise<Book> {
  const book = new Book(crypto.randomUUID(), title, true, new Date(), new Date());
  return await this.bookRepository.create(book);
 }
 async findById(id:string):Promise<Book | null> {
  return await this.bookRepository.findById(id);
 }
}