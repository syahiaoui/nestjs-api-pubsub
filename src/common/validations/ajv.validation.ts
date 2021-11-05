import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv({ allErrors: true });
ajv.addVocabulary(['version', 'keys']);
addFormats(ajv);

export interface IValidationResult {
  readonly status: boolean;
  readonly failures?: ErrorObject[] | null;
}

export const schemaValidation = async (
  JSC: object,
  data: object,
): Promise<IValidationResult> => {
  const valid = await ajv.validate(JSC, data);
  return { status: valid, failures: ajv.errors };
};
