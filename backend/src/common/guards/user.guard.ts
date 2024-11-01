import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user.user;

    if (user && (user.role === 'AG01' || user.role === 'AG02')) {
      return true;
    }
    // Debugging statement to log the access denied reason
    console.log('Access denied: User does not have the required role');
    throw new ForbiddenException('Access denied');
  }
}
