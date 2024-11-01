import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // console.log("============= : "+JSON.stringify(request));
    //  console.log("============= : "+request.headers['authorization']);
    // const token = request.headers.authorization?.split(' ')[1]; // Access bearer token
    // console.log('Received bearer token:', token);
    return request.headers['authorization'];
  },
);
