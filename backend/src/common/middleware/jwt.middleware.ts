import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // Retrieve the token from the request headers
    const token = req.headers.authorization;

    // Log the token
    this.logger.log(`JWT Token: ${token}`);

    // Pass control to the next middleware
    next();
  }
}
