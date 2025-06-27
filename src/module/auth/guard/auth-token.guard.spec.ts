import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenGuard } from './auth-token.guard';
import { REQUEST_TOKEN_PAYLOAD_NAME } from '../common/auth.constants';

const mockJwtService = {
  verifyAsync: jest.fn(),
};
const mockJwtConfig = {};

describe('AuthTokenGuard', () => {
  let guard: AuthTokenGuard;
  let context: any;

  beforeEach(() => {
    guard = new AuthTokenGuard(mockJwtService as any, mockJwtConfig as any);
    context = {
      switchToHttp: () => ({
        getRequest: jest.fn(),
      }),
    };
    jest.clearAllMocks();
  });

  function setRequest(headers: any = {}, body: any = {}) {
    const req: any = { headers, body };
    context.switchToHttp = () => ({ getRequest: () => req });
    return req;
  }

  it('should throw Unauthorized if no token', async () => {
    setRequest({});
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw Unauthorized if token is invalid', async () => {
    setRequest({ authorization: 'Bearer invalidtoken' });
    mockJwtService.verifyAsync.mockRejectedValue(new Error('invalid'));
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should set payload and allow if token is valid', async () => {
    const payload = { sub: 1, role: 'admin' };
    setRequest({ authorization: 'Bearer validtoken' });
    mockJwtService.verifyAsync.mockResolvedValue(payload);
    const req = context.switchToHttp().getRequest();
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(req[REQUEST_TOKEN_PAYLOAD_NAME]).toEqual(payload);
  });
}); 