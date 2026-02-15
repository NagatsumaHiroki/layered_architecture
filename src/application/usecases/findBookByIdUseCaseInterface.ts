import type { FindBookByIdRequestDto } from "./dtos/book/FindBookByIdRequestDto.js";
import type { FindBookByIdResponseDto } from "./dtos/book/FindBookByIdResponseDto.js";

export interface FindBookByIdUseCaseInterface {
    execute(request: FindBookByIdRequestDto): Promise<FindBookByIdResponseDto | null>;
}
