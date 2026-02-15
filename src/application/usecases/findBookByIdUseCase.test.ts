import { FindBookByIdUseCase } from "./findBookByIdUseCase.js";
import { Book } from "../../domain/entities/book.js";
import type { BookRepositoryInterface } from "../../domain/entities/repositories/bookRepositoryInterface.js";

describe("FindBookByIdUseCase", () => {
  // テスト用の固定値
  const fixedDate = new Date("2024-01-01T00:00:00.000Z");

  let mockBookRepository: jest.Mocked<BookRepositoryInterface>;
  let findBookByIdUseCase: FindBookByIdUseCase;

  beforeEach(() => {
    // 各テスト前にモックをリセット
    mockBookRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    };
    findBookByIdUseCase = new FindBookByIdUseCase(mockBookRepository);
  });

  describe("正常系", () => {
    it("存在するIDを指定すると、該当する書籍情報が返る", async () => {
      const existingBook = new Book("book-123", "存在する書籍", true, fixedDate, fixedDate);
      mockBookRepository.findById.mockResolvedValue(existingBook);

      const result = await findBookByIdUseCase.execute({ id: "book-123" });

      expect(result).toEqual({
        id: "book-123",
        title: "存在する書籍",
        isAvailable: true,
        createAt: fixedDate,
        updatedAt: fixedDate,
      });
    });

    it("貸出中の書籍を取得すると、isAvailableがfalseで返る", async () => {
      const loanedBook = new Book("book-456", "貸出中の書籍", false, fixedDate, fixedDate);
      mockBookRepository.findById.mockResolvedValue(loanedBook);

      const result = await findBookByIdUseCase.execute({ id: "book-456" });

      expect(result).not.toBeNull();
      expect(result!.isAvailable).toBe(false);
    });

    it("bookRepositoryのfindById()が正しいIDで1回呼ばれる", async () => {
      const existingBook = new Book("book-123", "テスト書籍", true, fixedDate, fixedDate);
      mockBookRepository.findById.mockResolvedValue(existingBook);

      await findBookByIdUseCase.execute({ id: "book-123" });

      expect(mockBookRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockBookRepository.findById).toHaveBeenCalledWith("book-123");
    });
  });

  describe("異常系", () => {
    it("存在しないIDを指定すると、nullが返る", async () => {
      mockBookRepository.findById.mockResolvedValue(null);

      const result = await findBookByIdUseCase.execute({ id: "non-existent-id" });

      expect(result).toBeNull();
    });

    it("空文字のIDを指定しても、リポジトリが呼ばれnullが返る", async () => {
      mockBookRepository.findById.mockResolvedValue(null);

      const result = await findBookByIdUseCase.execute({ id: "" });

      expect(mockBookRepository.findById).toHaveBeenCalledWith("");
      expect(result).toBeNull();
    });

    it("リポジトリがエラーをスローした場合、そのエラーが伝播する", async () => {
      const repositoryError = new Error("Database connection failed");
      mockBookRepository.findById.mockRejectedValue(repositoryError);

      await expect(findBookByIdUseCase.execute({ id: "book-123" })).rejects.toThrow(
        "Database connection failed"
      );
    });
  });
});
