export default class ErrorApi extends Error {
  code: number;
  status: string = "error";
  constructor(message: string = "internal server error", code = 500) {
    super(message)
    this.code = code;
  }
  getError() {
    return {
      status: this.status,
      code: this.code,
      message: this.message
    }
  }
}