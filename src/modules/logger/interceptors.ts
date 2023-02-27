import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
  UnprocessableEntityException,
  ForbiddenException,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          throw new NotFoundException();
        }

        return data;
      }),
    );
  }
}

@Injectable()
export class ForbiddenInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          throw new ForbiddenException();
        }

        return data;
      }),
    );
  }
}

@Injectable()
export class UnprocessableEntityInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          throw new UnprocessableEntityException();
        }

        return data;
      }),
    );
  }
}
