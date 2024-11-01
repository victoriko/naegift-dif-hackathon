import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    // console.log("============ : " +JSON.stringify(req));
    return req.user;
  },
);

export const CurUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const { user, member } = req.user;

    if (data) {
      return data === 'user' ? user : member;
    }

    return { user, member };
  },
);
