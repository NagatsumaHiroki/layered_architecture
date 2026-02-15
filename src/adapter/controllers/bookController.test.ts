import { BookController } from "./bookController.js";
import type { Request, Response } from "express";
import type { AddBookUseCaseInterface } from "../../application/usecases/addBookUseCaseInterface.js";
import type { FindBookByIdUseCaseInterface } from "../../application/usecases/findBookByIdUseCaseInterface.js";
import type { AddBookResponseDto } from "../../application/usecases/dtos/book/AddBookResponseDto.js";
import type { FindBookByIdResponseDto } from "../../application/usecases/dtos/book/FindBookByIdResponseDto.js";

describe("BookController", () => {
  // テスト用の固定値
  const fixedDate = new Date("2024-01-01T00:00:00.000Z");

  let mockAddBookUseCase: jest.Mocked<AddBookUseCaseInterface>;
  let mockFindBookByIdUseCase: jest.Mocked<FindBookByIdUseCaseInterface>;
  let bookController: BookController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // UseCaseのモック
    mockAddBookUseCase = {
      execute: jest.fn(),
    };
    mockFindBookByIdUseCase = {
      execute: jest.fn(),
    };

    bookController = new BookController(mockAddBookUseCase, mockFindBookByIdUseCase);

    // Response のモック
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    // console.errorをモック（エラーログの出力を抑制）
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("add()", () => {
    describe("正常系", () => {
      it("有効なtitleで書籍を追加すると、201ステータスと書籍情報が返る", async () => {
        const responseDto: AddBookResponseDto = {
          id: "book-123",
          title: "新しい書籍",
          isAvailable: true,
          createAt: fixedDate,
          updatedAt: fixedDate,
        };
        mockAddBookUseCase.execute.mockResolvedValue(responseDto);
        mockRequest = {
          body: { title: "新しい書籍" },
        };

        await bookController.add(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalledWith(responseDto);
      });

      it("titleの前後の空白がトリムされてUseCaseに渡される", async () => {
        const responseDto: AddBookResponseDto = {
          id: "book-123",
          title: "トリムされた書籍",
          isAvailable: true,
          createAt: fixedDate,
          updatedAt: fixedDate,
        };
        mockAddBookUseCase.execute.mockResolvedValue(responseDto);
        mockRequest = {
          body: { title: "  トリムされた書籍  " },
        };

        await bookController.add(mockRequest as Request, mockResponse as Response);

        expect(mockAddBookUseCase.execute).toHaveBeenCalledWith({
          title: "トリムされた書籍",
        });
      });
    });

    describe("異常系", () => {
      it("titleがundefinedの場合、400エラーが返る", async () => {
        mockRequest = {
          body: {},
        };

        await bookController.add(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: "title is required" });
        expect(mockAddBookUseCase.execute).not.toHaveBeenCalled();
      });

      it("titleがnullの場合、400エラーが返る", async () => {
        mockRequest = {
          body: { title: null },
        };

        await bookController.add(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: "title is required" });
      });

      it("titleが空文字の場合、400エラーが返る", async () => {
        mockRequest = {
          body: { title: "" },
        };

        await bookController.add(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: "title is required" });
      });

      it("titleが空白のみの場合、400エラーが返る", async () => {
        mockRequest = {
          body: { title: "   " },
        };

        await bookController.add(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: "title is required" });
      });

      it("titleが数値の場合、400エラーが返る", async () => {
        mockRequest = {
          body: { title: 12345 },
        };

        await bookController.add(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: "title is required" });
      });

      it("UseCaseがエラーをスローした場合、500エラーが返る", async () => {
        mockAddBookUseCase.execute.mockRejectedValue(new Error("Database error"));
        mockRequest = {
          body: { title: "テスト書籍" },
        };

        await bookController.add(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({ error: "Failed to add book" });
      });
    });
  });

  describe("findById()", () => {
    describe("正常系", () => {
      it("存在するIDで検索すると、200ステータスと書籍情報が返る", async () => {
        const responseDto: FindBookByIdResponseDto = {
          id: "book-123",
          title: "見つかった書籍",
          isAvailable: true,
          createAt: fixedDate,
          updatedAt: fixedDate,
        };
        mockFindBookByIdUseCase.execute.mockResolvedValue(responseDto);
        mockRequest = {
          params: { id: "book-123" },
        };

        await bookController.findById(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith(responseDto);
      });

      it("IDの前後の空白がトリムされてUseCaseに渡される", async () => {
        const responseDto: FindBookByIdResponseDto = {
          id: "book-123",
          title: "テスト書籍",
          isAvailable: true,
          createAt: fixedDate,
          updatedAt: fixedDate,
        };
        mockFindBookByIdUseCase.execute.mockResolvedValue(responseDto);
        mockRequest = {
          params: { id: "  book-123  " },
        };

        await bookController.findById(mockRequest as Request, mockResponse as Response);

        expect(mockFindBookByIdUseCase.execute).toHaveBeenCalledWith({
          id: "book-123",
        });
      });
    });

    describe("異常系", () => {
      it("存在しないIDで検索すると、404エラーが返る", async () => {
        mockFindBookByIdUseCase.execute.mockResolvedValue(null);
        mockRequest = {
          params: { id: "non-existent-id" },
        };

        await bookController.findById(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: "Book not found" });
      });

      it("IDがundefinedの場合、400エラーが返る", async () => {
        mockRequest = {
          params: {},
        };

        await bookController.findById(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: "id is required" });
        expect(mockFindBookByIdUseCase.execute).not.toHaveBeenCalled();
      });

      it("IDが空文字の場合、400エラーが返る", async () => {
        mockRequest = {
          params: { id: "" },
        };

        await bookController.findById(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: "id is required" });
      });

      it("IDが空白のみの場合、400エラーが返る", async () => {
        mockRequest = {
          params: { id: "   " },
        };

        await bookController.findById(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: "id is required" });
      });

      it("UseCaseがエラーをスローした場合、500エラーが返る", async () => {
        mockFindBookByIdUseCase.execute.mockRejectedValue(new Error("Database error"));
        mockRequest = {
          params: { id: "book-123" },
        };

        await bookController.findById(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({ error: "Failed to find book" });
      });
    });
  });
});
