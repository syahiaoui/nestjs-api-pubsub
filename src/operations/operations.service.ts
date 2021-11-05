'use strict';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import empty from 'is-empty';
import moment from 'moment-timezone';

import { IResponse } from 'src/common/interfaces/response.interface';
import { Data, RequestBody } from './generics/data.generic';
import { OperationEntity } from './entities/operation.entity';
import { publishMessageWithCustomAttributes } from '../common/pubsub/publishMessage';
import userSchema from '../common/schemas/user.schema.json'; //we can create a registry schema and retrieve the schema when the server starts
import {
  DateEnum,
  OperationType,
  ApiDescriptionMessage,
} from '../utils/constants';

@Injectable()
export class OperationsService {
  generateDateISO(): string {
    return moment()
      .utc()
      .tz(DateEnum.TIMEZONE)
      .format(DateEnum.ISO_DATE_FORMAT);
  }

  generateKey(data: Data<RequestBody>, props: string[]): string {
    return props
      .map((prop: string) => data[prop])
      .filter((value: any) => !empty(value))
      .join('_')
      .toUpperCase();
  }

  buildCreateOperation(
    createOperation: Data<RequestBody>,
    userSchemaKeys: string[],
  ): OperationEntity {
    const operation: OperationEntity = new OperationEntity();
    const key = this.generateKey(createOperation, userSchemaKeys);
    operation.data = createOperation;
    operation.processId = uuidv4();
    operation.operationType = OperationType.MUTATION;
    operation.key = key;
    operation.processDate = this.generateDateISO();
    return operation;
  }

  buildRemoveOperation(key: string): OperationEntity {
    const operation: OperationEntity = new OperationEntity();
    operation.processId = uuidv4();
    operation.key = key;
    operation.operationType = OperationType.DELETION;
    operation.processDate = this.generateDateISO();
    return operation;
  }

  async create(createOperation: Data<RequestBody>): Promise<IResponse> {
    const operation: OperationEntity = this.buildCreateOperation(
      createOperation,
      userSchema.keys,
    );
    const { key, processId } = operation;
    const messageId = await publishMessageWithCustomAttributes(operation);
    if (empty(messageId))
      throw new InternalServerErrorException({
        desciption: `Can't publish message to "pubsub"`,
      });
    return { processId, key, description: ApiDescriptionMessage.ACKNOWLEDGED };
  }

  async remove(key: string): Promise<IResponse> {
    const operation: OperationEntity = this.buildRemoveOperation(key);
    const messageId = await publishMessageWithCustomAttributes(operation);
    const { processId } = operation;
    if (empty(messageId))
      throw new InternalServerErrorException({
        desciption: `Can't publish message to "pubsub"`,
      });
    return {
      processId,
      key,
      description: ApiDescriptionMessage.DELETE_ACKNOWLEDGED,
    };
  }
}
