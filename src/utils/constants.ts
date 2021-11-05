'use strict';

export enum DateEnum {
  ISO_DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
  DATE_FORMAT = 'YYYY-MM-DD',
  TIMEZONE = 'Europe/Paris',
}

export enum OperationType {
  MUTATION = 'MUTATION',
  DELETION = 'DELETION',
}

export enum ApiDescriptionMessage {
  'ACKNOWLEDGED' = 'The operation request has been acknowledged and is now being processed',
  'DELETE_ACKNOWLEDGED' = 'The deletion request has been acknowledged and is now being processed',
}
