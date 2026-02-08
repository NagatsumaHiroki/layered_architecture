import { jest } from "@jest/globals";
import type { BookRepositoryInterface } from "../dataAccess/bookRepositoryInterface.js";
import { BookService } from "./bookService.js";
import type { Book } from "../generated/prisma/client.js";

const mockBookRepository: jest.Mocked<BookRepositoryInterface> = {
    create: jest.fn(),
    findById: jest.fn(),
};

const buildBook = (overrides: Partial<Book> = {}): Book => ({
    id: "1",
    title: "Test Book",
    isAvailable: true,
    createAt: new Date(0),
    updatedAt: new Date(0),
    ...overrides,
});

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
        expect(mockBookRepository.create).toHaveBeenCalledWith("Test Book");
    });
    it("書籍の取得が成功する", async () => {
        const book = buildBook();
        mockBookRepository.findById.mockResolvedValue(book);

        const result = await bookService.findById("1");

        expect(result).toEqual(book);
        expect(mockBookRepository.findById).toHaveBeenCalledWith("1");
    });
});