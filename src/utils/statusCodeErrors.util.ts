export class statusCodeErrors {
  message: string;
  name: string;
  statusCode: number;
  constructor(message: string, statusCode: number) {
    // super(message)
    this.message = message;
    this.name = "StatusCodeError";
    this.statusCode = statusCode;
  }
};