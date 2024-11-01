import { HttpException } from '@nestjs/common';
import { ErrorCode } from './error.code';

export class CustomException extends HttpException {
  constructor(statusCode: number) {
    super({ statusCode, message: ErrorCode(statusCode) }, statusCode);
  }
}
