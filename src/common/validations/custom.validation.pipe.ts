'use strict';
import empty from 'is-empty';
import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { schemaValidation } from './ajv.validation';
import userSchema from '../schemas/user.schema.json'; //we can make import the schema from schema regitry
import { IValidationResult } from './ajv.validation';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any) {
    if (empty(value)) {
      throw new HttpException(
        `Validation failed: No payload provided`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const result: IValidationResult = await schemaValidation(userSchema, value);
    if (!empty(result.failures)) {
      throw new HttpException(
        JSON.parse(JSON.stringify(result.failures)),
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
