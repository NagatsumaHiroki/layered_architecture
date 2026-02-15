import type { BookRepositoryInterface } from "../../domain/entities/repositories/bookRepositoryInterface.js";
import type { IdGeneratorInterface } from "../../domain/entities/repositories/utils/idGeneratorInterface.js";
import type { AddBookRequestDto } from "./dtos/book/AddBookRequestDto.js";
import type { AddBookResponseDto } from "./dtos/book/AddBookResponseDto.js";
import type { AddBookUseCaseInterface } from "./addBookUseCaseInterface.js";
import { Book } from "../../domain/entities/book.js";

export class AddBookUseCase implements AddBookUseCaseInterface {
    constructor(
        private readonly bookRepository: BookRepositoryInterface,
        private readonly idGenerator: IdGeneratorInterface
    ) {}

    async execute(request: AddBookRequestDto): Promise<AddBookResponseDto> {
        const id = this.idGenerator.generate();
        const newBook = new Book(id, request.title, true, new Date(), new Date());
        const createdBook = await this.bookRepository.create(newBook);

        return {
            id: createdBook.id,
            title: createdBook.title,
            isAvailable: createdBook.isAvailable,
            createAt: createdBook.createAt,
            updatedAt: createdBook.updatedAt,
        };
    }
}
