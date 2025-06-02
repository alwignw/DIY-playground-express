export class ResponseError extends Error {
  constructor(public status: number, public message: string, public displayMessage?: string) {
    super(message);
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}