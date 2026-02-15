import { Book } from "./book.js";

describe("Book", () => {
  // テスト用の固定日時
  const fixedDate = new Date("2024-01-01T00:00:00.000Z");

  describe("コンストラクタ", () => {
    it("指定したid, title, isAvailable, createAt, updatedAtでBookを生成できる", () => {
      const book = new Book("book-123", "テスト書籍", true, fixedDate, fixedDate);

      expect(book.id).toBe("book-123");
      expect(book.title).toBe("テスト書籍");
      expect(book.isAvailable).toBe(true);
      expect(book.createAt).toEqual(fixedDate);
      expect(book.updatedAt).toEqual(fixedDate);
    });

    it("isAvailableのデフォルト値はtrueである", () => {
      const book = new Book("book-123", "テスト書籍");

      expect(book.isAvailable).toBe(true);
    });
  });

  describe("loan()", () => {
    describe("正常系", () => {
      it("貸出可能な書籍を貸し出すと、isAvailableがfalseになる", () => {
        const book = new Book("book-123", "テスト書籍", true, fixedDate, fixedDate);

        book.loan();

        expect(book.isAvailable).toBe(false);
      });
    });

    describe("異常系", () => {
      it("既に貸出中の書籍を貸し出そうとすると、エラーがスローされる", () => {
        const book = new Book("book-123", "テスト書籍", false, fixedDate, fixedDate);

        expect(() => book.loan()).toThrow("Book is not available");
      });

      it("貸出後に再度貸し出そうとすると、エラーがスローされる", () => {
        const book = new Book("book-123", "テスト書籍", true, fixedDate, fixedDate);
        book.loan();

        expect(() => book.loan()).toThrow("Book is not available");
      });
    });
  });

  describe("return()", () => {
    describe("正常系", () => {
      it("貸出中の書籍を返却すると、isAvailableがtrueになる", () => {
        const book = new Book("book-123", "テスト書籍", false, fixedDate, fixedDate);

        book.return();

        expect(book.isAvailable).toBe(true);
      });
    });

    describe("異常系", () => {
      it("既に返却済みの書籍を返却しようとすると、エラーがスローされる", () => {
        const book = new Book("book-123", "テスト書籍", true, fixedDate, fixedDate);

        expect(() => book.return()).toThrow("Book is already returned");
      });

      it("返却後に再度返却しようとすると、エラーがスローされる", () => {
        const book = new Book("book-123", "テスト書籍", false, fixedDate, fixedDate);
        book.return();

        expect(() => book.return()).toThrow("Book is already returned");
      });
    });
  });

  describe("貸出・返却の連続操作", () => {
    it("貸出→返却→貸出の順で操作できる", () => {
      const book = new Book("book-123", "テスト書籍", true, fixedDate, fixedDate);

      book.loan();
      expect(book.isAvailable).toBe(false);

      book.return();
      expect(book.isAvailable).toBe(true);

      book.loan();
      expect(book.isAvailable).toBe(false);
    });
  });
});
