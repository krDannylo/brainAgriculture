import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { REQUEST_TOKEN_PAYLOAD_NAME } from 'src/module/auth/common/auth.constants';

@Injectable()
export class ApplyUserIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const payload = request[REQUEST_TOKEN_PAYLOAD_NAME];
    // console.log("payload: ", payload)

    if (payload?.role !== 'admin') {
      request.body.farmerId = payload.sub;
    }

    return next.handle();
  }
}