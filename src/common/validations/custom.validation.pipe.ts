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
import { Data } from 'src/operations/generics/data.generic';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: Data<object>) {
    if (
      empty(value) ||
      !(typeof value === 'object' && Object.keys(value).length > 0)
    ) {
      throw new HttpException(
        `Validation failed: Payload must be an object with at least one key`,
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
