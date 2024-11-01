import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response.decorator';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  // Intercepts the request and modifies the response
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // Get the custom response message from the handler's metadata or use 'SUCCESS' as default
    const responseMessage =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ||
      'SUCCESS';

    return next.handle().pipe(
      map((data) => {
        // Get the current HTTP status code
        const response = context.switchToHttp().getResponse();
        let statusCode = response.statusCode;

        // If the status code is 201, change it to 200
        if (statusCode === 201) {
          statusCode = 200;
          response.statusCode = 200; // Explicitly set the status code to 200
        }

        // Check if data is null or undefined and set it to null if it is
        if (data === null || data === undefined) {
          data = null;
        }

        // Return the modified response structure
        return {
          resultCode: statusCode,
          resultMessage: responseMessage,
          data,
        };
      }),
    );
  }
}

// Interface for the response structure
interface Response<T> {
  resultCode: number;
  resultMessage: string;
  data: T;
}
