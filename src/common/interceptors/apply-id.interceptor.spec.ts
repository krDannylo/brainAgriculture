import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { ApplyUserIdInterceptor } from './apply-id.interceptor';
import { REQUEST_TOKEN_PAYLOAD_NAME } from 'src/module/auth/common/auth.constants';

describe('ApplyUserIdInterceptor', () => {
  let interceptor: ApplyUserIdInterceptor;
  let context: Partial<ExecutionContext>;
  let next: Partial<CallHandler>;

  beforeEach(() => {
    interceptor = new ApplyUserIdInterceptor();
    next = { handle: jest.fn(() => of('result')) };
  });

  function mockRequest(payload: any, body: any = {}) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          [REQUEST_TOKEN_PAYLOAD_NAME]: payload,
          body,
        }),
      }),
    } as any;
  }

  it('should add farmerId to body if not admin', () => {
    const payload = { role: 'farmer', sub: 123 };
    const body: any = {};
    context = mockRequest(payload, body);
    interceptor.intercept(context as ExecutionContext, next as CallHandler).subscribe();
    expect(body.farmerId).toBe(123);
    expect(next.handle).toHaveBeenCalled();
  });

  it('should not add farmerId to body if admin', () => {
    const payload = { role: 'admin', sub: 999 };
    const body: any = {};
    context = mockRequest(payload, body);
    interceptor.intercept(context as ExecutionContext, next as CallHandler).subscribe();
    expect(body.farmerId).toBeUndefined();
    expect(next.handle).toHaveBeenCalled();
  });
}); 