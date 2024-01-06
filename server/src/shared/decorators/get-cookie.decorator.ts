import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

/**
 * Get cookies
 */
export const GetCookies = createParamDecorator(
  <T extends string | string[]>(
    data: T,
    ctx: ExecutionContext,
  ): string | Record<string, string> | undefined => {
    const request: Request = ctx.switchToHttp().getRequest();

    return request.cookies[data];
  },
);
