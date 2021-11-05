import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { AppModule } from '../../src/app.module';
import { OperationsController } from './operations.controller';
import { OperationsService } from './operations.service';

const endpoint = `/operations`;

jest.mock('uuid');
jest.mock('../common/pubsub/publishMessage');
describe('OperationsController', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [OperationsController],
      providers: [OperationsService],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  describe('should return status code 202 for deletion data (ACCEPTED)', () => {
    it('(DELETE) /operations', async () => {
      uuidv4.mockImplementation(() => '63422f55-42df-485e-8150-c4456674d053');
      const response = await request(app.getHttpServer()).delete(
        `${endpoint}/12021_labs`,
      );
      expect(response.statusCode).toEqual(HttpStatus.ACCEPTED);
      expect(response.body).toEqual({
        processId: '63422f55-42df-485e-8150-c4456674d053',
        key: '12021_LABS',
        description:
          'The deletion request has been acknowledged and is now being processed',
      });
    });
    it('should return status code 500 whene integration is failed to be published in the topic pubsub (DELETE)', async () => {
      uuidv4.mockImplementation(() => '63422f55-42df-485e-8150-c4456674d053');
      const response = await request(app.getHttpServer()).delete(
        `${endpoint}/78910_toFail`,
      );
      expect(response.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        desciption: `Can't publish message to "pubsub"`,
      });
    });
  });
  describe('(PUT)', () => {
    // jest.restoreAllMocks();
    it('should return status code 202 for data integration (ACCEPTED)', async () => {
      uuidv4.mockImplementation(() => '15809aa8-540c-4a30-a293-f6c9ce9e2dc2');
      const response = await request(app.getHttpServer())
        .put(`${endpoint}`)
        .set('accept', 'application/json')
        .set('content-type', 'application/json')
        .type('JSON')
        .send({
          personalNumber: 123456,
          firstName: 'zenika',
          lastName: 'labs',
          email: 'xyz@zenika.com',
          creationDate: '2021-11-04T17:53:04.175Z',
        });
      expect(response.statusCode).toEqual(HttpStatus.ACCEPTED);
      expect(response.body).toEqual({
        processId: '15809aa8-540c-4a30-a293-f6c9ce9e2dc2',
        key: '123456_LABS',
        description:
          'The operation request has been acknowledged and is now being processed',
      });
    });
    it('should return status code 500 whene integration is failed to be published in the topic pubsub', async () => {
      uuidv4.mockImplementation(() => '15809aa8-540c-4a30-a293-f6c9ce9e2dc2');
      const response = await request(app.getHttpServer())
        .put(`${endpoint}`)
        .set('accept', 'application/json')
        .set('content-type', 'application/json')
        .type('JSON')
        .send({
          personalNumber: 78910,
          firstName: 'zenika',
          lastName: 'toFail',
          email: 'xyz@zenika.com',
          creationDate: '2021-11-04T17:53:04.175Z',
        });
      expect(response.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        desciption: `Can't publish message to "pubsub"`,
      });
    });
  });
});
