import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../../auth/auth.service';
import { jwtConstants } from '../constants/app.constant';
import { Member, User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.SECRET_KEY,
    });
  }

  async validate(payload: any) {
    let user: User;
    let member: Member;

    this.logger.debug(`payload => ${JSON.stringify(payload)}`);

    if (payload.userNo > 0) {
      user = await this.authService.validateUser(payload.userNo);
    } else if (payload.memberNo > 0) {
      member = await this.authService.validateMember(payload.memberNo);
    }

    if (!user && !member) {
      throw new UnauthorizedException();
    }

    // Combine user and member into a single object and return
    return { user, member };
  }
}
