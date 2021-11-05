import { ErrorObject } from 'ajv';

export interface IResponse {
  readonly processId: string;
  readonly description: string;
  readonly key: string;
  readonly failures?: ErrorObject | null;
}
