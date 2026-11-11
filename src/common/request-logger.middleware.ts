import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // Log the request information
    console.log("req info :::", req.method, req.hostname, req.originalUrl, req.body);
    next();
  }
}
