import { jest } from "@jest/globals";
import type { BookRepositoryInterface } from "../domain/entities/repostirories/bookRepositoryInterface.js";
import { BookService } from "./bookService.js";
import { Book } from "../domain/entities/book.js";

const mockBookRepository: jest.Mocked<BookRepositoryInterface> = {
    create: jest.fn(),
    findById: jest.fn(),
};

const buildBook = (overrides: {
    id?: string;
    title?: string;
    isAvailable?: boolean;
    createAt?: Date;
    updatedAt?: Date;
} = {}): Book =>
    new Book(
        overrides.id ?? "1",
        overrides.title ?? "Test Book",
        overrides.isAvailable ?? true,
        overrides.createAt ?? new Date(0),
        overrides.updatedAt ?? new Date(0)
    );

describe("BookService", () => {
    let bookService: BookService;
    beforeEach(() => {
        bookService = new BookService(mockBookRepository);
    });

    // テスト後にモックをクリア
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("書籍の登録が成功する", async () => {
        const newBook = buildBook();

        mockBookRepository.create.mockResolvedValue(newBook);

        const result = await bookService.add("Test Book");

        // 結果が期待通りかチェック
        expect(result).toEqual(newBook);
        //モックが正しい引数で呼ばれているか
        expect(mockBookRepository.create).toHaveBeenCalledWith(expect.any(Book));
    });
    it("書籍の取得が成功する", async () => {
        const book = buildBook();
        mockBookRepository.findById.mockResolvedValue(book);

        const result = await bookService.findById("1");

        expect(result).toEqual(book);
        expect(mockBookRepository.findById).toHaveBeenCalledWith("1");
    });
});