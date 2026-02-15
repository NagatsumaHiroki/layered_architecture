import type { BookRepositoryInterface } from "../../domain/entities/repostirories/bookRepositoryInterface.js";
import type { FindBookByIdRequestDto } from "./dtos/book/FindBookByIdRequestDto.js";
import type { FindBookByIdResponseDto } from "./dtos/book/FindBookByIdResponseDto.js";
import type { FindBookByIdUseCaseInterface } from "./findBookByIdUseCaseInterface.js";

export class FindBookByIdUseCase implements FindBookByIdUseCaseInterface {
    constructor(private readonly bookRepository: BookRepositoryInterface) {}

    async execute(request: FindBookByIdRequestDto): Promise<FindBookByIdResponseDto | null> {
        const book = await this.bookRepository.findById(request.id);
        if (!book) {
            return null;
        }

        return {
            id: book.id,
            title: book.title,
            isAvailable: book.isAvailable,
            createAt: book.createAt,
            updatedAt: book.updatedAt,
        };
    }
}
