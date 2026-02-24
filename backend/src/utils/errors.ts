export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor); // Captura o stack trace
  }
}
export class ConflictError extends CustomError {
  constructor(message: string = 'Recurso já existe.') {
    super(message, 409); // 409 Conflict
  }
}
export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Credenciais inválidas.') {
    super(message, 401); // 401 Unauthorized
  }
}
export class BadRequestError extends CustomError {
  constructor(message: string = 'Requisição inválida.') {
    super(message, 400); // 400 Bad Request
  }
}
