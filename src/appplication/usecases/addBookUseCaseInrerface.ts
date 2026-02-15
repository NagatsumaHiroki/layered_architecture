import type { AddBookRequestDto } from "./dtos/book/AddBookRequestDto.js";
import type { AddBookResponseDto } from "./dtos/book/AddBookResponseDto.js";

export interface AddBookUseCaseInterface {
    execute(request: AddBookRequestDto): Promise<AddBookResponseDto>;
}