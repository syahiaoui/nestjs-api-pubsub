import { ErrorObject } from 'ajv';
import { Data, RequestBody } from '../generics/data.generic';

export class OperationEntity {
  public processId: string;
  public key: string;
  public operationType: string;
  public data: Data<RequestBody>;
  public processDate: string;
  public failure?: ErrorObject | null;
}
