export class Book {
  constructor(
    private _id: string,
    private _title: string,
    private _isAvailable: boolean = true,
    private _createAt: Date = new Date(),
    private _updatedAt: Date = new Date(),
  ) {}

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  get createAt(): Date {
    return this._createAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  loan() {
    if (!this._isAvailable) {
      throw new Error("Book is not available");
    }
    this._isAvailable = false;
  }

  return() {
    if (this._isAvailable) {
      throw new Error("Book is already returned");
    }
    this._isAvailable = true;
  }
}