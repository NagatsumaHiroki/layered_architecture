import { AddBookUseCase } from "./addBookUseCase.js";
import { Book } from "../../domain/entities/book.js";
import type { BookRepositoryInterface } from "../../domain/entities/repositories/bookRepositoryInterface.js";
import type { IdGeneratorInterface } from "../../domain/entities/repositories/utils/idGeneratorInterface.js";

describe("AddBookUseCase", () => {
  // テスト用の固定値
  const fixedId = "generated-uuid-123";
  const fixedDate = new Date("2024-01-01T00:00:00.000Z");

  let mockBookRepository: jest.Mocked<BookRepositoryInterface>;
  let mockIdGenerator: jest.Mocked<IdGeneratorInterface>;
  let addBookUseCase: AddBookUseCase;

  beforeEach(() => {
    // 各テスト前にモックをリセット
    mockBookRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    };
    mockIdGenerator = {
      generate: jest.fn().mockReturnValue(fixedId),
    };
    addBookUseCase = new AddBookUseCase(mockBookRepository, mockIdGenerator);

    // Dateを固定化
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("正常系", () => {
    it("タイトルを指定して書籍を追加すると、生成されたIDと書籍情報を含むレスポンスが返る", async () => {
      const requestDto = { title: "新しい書籍" };
      const expectedBook = new Book(fixedId, "新しい書籍", true, fixedDate, fixedDate);

      mockBookRepository.create.mockResolvedValue(expectedBook);

      const result = await addBookUseCase.execute(requestDto);

      expect(result).toEqual({
        id: fixedId,
        title: "新しい書籍",
        isAvailable: true,
        createAt: fixedDate,
        updatedAt: fixedDate,
      });
    });

    it("idGeneratorのgenerate()が1回呼ばれる", async () => {
      const requestDto = { title: "テスト書籍" };
      const expectedBook = new Book(fixedId, "テスト書籍", true, fixedDate, fixedDate);
      mockBookRepository.create.mockResolvedValue(expectedBook);

      await addBookUseCase.execute(requestDto);

      expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it("bookRepositoryのcreate()が正しい引数で1回呼ばれる", async () => {
      const requestDto = { title: "テスト書籍" };
      const expectedBook = new Book(fixedId, "テスト書籍", true, fixedDate, fixedDate);
      mockBookRepository.create.mockResolvedValue(expectedBook);

      await addBookUseCase.execute(requestDto);

      expect(mockBookRepository.create).toHaveBeenCalledTimes(1);
      const calledBook = mockBookRepository.create.mock.calls[0][0];
      expect(calledBook.id).toBe(fixedId);
      expect(calledBook.title).toBe("テスト書籍");
      expect(calledBook.isAvailable).toBe(true);
    });
  });

  describe("異常系", () => {
    it("リポジトリがエラーをスローした場合、そのエラーが伝播する", async () => {
      const requestDto = { title: "テスト書籍" };
      const repositoryError = new Error("Database connection failed");
      mockBookRepository.create.mockRejectedValue(repositoryError);

      await expect(addBookUseCase.execute(requestDto)).rejects.toThrow("Database connection failed");
    });
  });
});
