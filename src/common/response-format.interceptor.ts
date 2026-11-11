import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map( response => {
        return {
          status: true,
          statusCode : context.switchToHttp().getResponse().statusCode,
          data: response,
        };
      })
    );
  }
}
