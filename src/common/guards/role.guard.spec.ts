import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './role.guard';
import { REQUEST_TOKEN_PAYLOAD_NAME } from 'src/module/auth/common/auth.constants';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let context: Partial<ExecutionContext>;

  beforeEach(() => {
    reflector = { getAllAndMerge: jest.fn() } as any;
    guard = new RolesGuard(reflector);
  });

  function mockRequest(user: any) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          [REQUEST_TOKEN_PAYLOAD_NAME]: user,
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  }

  it('should allow if no roles are required', () => {
    (reflector.getAllAndMerge as jest.Mock).mockReturnValue([]);
    context = mockRequest({ role: 'admin' });
    expect(guard.canActivate(context as ExecutionContext)).toBe(true);
  });

  it('should allow if user has required role', () => {
    (reflector.getAllAndMerge as jest.Mock).mockReturnValue(['admin']);
    context = mockRequest({ role: 'admin' });
    expect(guard.canActivate(context as ExecutionContext)).toBe(true);
  });

  it('should deny if user does not have required role', () => {
    (reflector.getAllAndMerge as jest.Mock).mockReturnValue(['admin']);
    context = mockRequest({ role: 'farmer' });
    expect(guard.canActivate(context as ExecutionContext)).toBe(false);
  });
}); 