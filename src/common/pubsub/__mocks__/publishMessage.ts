'use strict';
import { OperationEntity } from '../../../operations/entities/operation.entity';

export async function publishMessageWithCustomAttributes(
  data: OperationEntity,
): Promise<string> {
  if (data.key === '78910_TOFAIL') return null;
  return data.processId;
}
