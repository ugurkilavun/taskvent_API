export class statusCodeErrors extends Error {
  message: string;
  name: string;
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.message = message;
    this.name = "StatusCodeError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  };
};