import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeFieldsInterceptor implements NestInterceptor {
  constructor(private readonly fieldsToExclude: string[] = ['createdAt', 'updatedAt']) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => this.excludeFields(data, this.fieldsToExclude)),
    );
  }

  private excludeFields(data: any, fields: string[]): any {
    if (Array.isArray(data)) {
      return data.map(item => this.excludeFields(item, fields));
    }
    
    if (data && typeof data === 'object') {
      const newObj = { ...data };
      for (const field of fields) {
        if (newObj.hasOwnProperty(field)) {
          delete newObj[field];
        }
      }
      for (const key in newObj) {
        if (newObj.hasOwnProperty(key) && typeof newObj[key] === 'object' && newObj[key] !== null) {
          newObj[key] = this.excludeFields(newObj[key], fields);
        }
      }
      return newObj;
    }
    
    return data;
  }
}