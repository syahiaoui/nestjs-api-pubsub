/* eslint-disable @typescript-eslint/no-empty-interface */
'use strict';
import {
  Put,
  Body,
  Param,
  Delete,
  UsePipes,
  HttpCode,
  Controller,
  HttpStatus,
} from '@nestjs/common';
import { OperationsService } from './operations.service';
import { Data, RequestBody } from './generics/data.generic';
import { CustomValidationPipe } from '../common/validations/custom.validation.pipe';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Put()
  @UsePipes(new CustomValidationPipe())
  @HttpCode(HttpStatus.ACCEPTED)
  async create(@Body() createOperation: Data<RequestBody>) {
    return this.operationsService.create(createOperation);
  }

  @Delete(':key')
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('key') key: string) {
    return this.operationsService.remove(key.toUpperCase());
  }
}
