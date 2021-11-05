import { v4 as uuidv4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { Data, RequestBody } from './generics/data.generic';
import { OperationsService } from './operations.service';

const inputData = {
  personalNumber: 123456,
  firstName: 'zenika',
  lastName: 'labs',
  email: 'xyz@zenika.com',
  creationDate: '2021-11-04T17:53:04.175Z',
} as Data<RequestBody>;

jest.mock('uuid');
jest.mock('../common/pubsub/publishMessage');
describe('OperationsService', () => {
  let service: OperationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperationsService],
    }).compile();
    service = module.get<OperationsService>(OperationsService);
  });
  it('should generate document key', () => {
    const props: string[] = ['personalNumber', 'lastName'];
    const key: string = service.generateKey(inputData, props);
    expect(key).toEqual('123456_LABS');
  });
  undefined;
  it('should generate document key and ignore undefined values', () => {
    const props: string[] = ['personalNumber', 'lastName', 'notExist'];
    const key: string = service.generateKey(inputData, props);
    expect(key).toEqual('123456_LABS');
  });

  it('should build create operation (buildCreateOperation)', async () => {
    uuidv4.mockImplementation(() => 'd1f0da0d-10e1-44d1-94e0-02e228760b03');
    service.generateDateISO = jest
      .fn()
      .mockReturnValue('2021-11-05T16:22:19.190Z');

    const props: string[] = ['personalNumber', 'lastName'];
    const data = await service.buildCreateOperation(inputData, props);
    expect(data).toEqual({
      data: {
        personalNumber: 123456,
        firstName: 'zenika',
        lastName: 'labs',
        email: 'xyz@zenika.com',
        creationDate: '2021-11-04T17:53:04.175Z',
      },
      processId: 'd1f0da0d-10e1-44d1-94e0-02e228760b03',
      operationType: 'MUTATION',
      key: '123456_LABS',
      processDate: '2021-11-05T16:22:19.190Z',
    });
    expect(service).toBeDefined();
  });

  it('should build remove operation (buildRemoveOperation)', async () => {
    uuidv4.mockImplementation(() => 'd1f0da0d-10e1-44d1-94e0-02e228760b03');
    service.generateDateISO = jest
      .fn()
      .mockReturnValue('2021-11-05T16:40:09.190Z');

    const key = '181111_SY';
    const data = await service.buildRemoveOperation(key);
    expect(data).toEqual({
      processId: 'd1f0da0d-10e1-44d1-94e0-02e228760b03',
      operationType: 'DELETION',
      key: '181111_SY',
      processDate: '2021-11-05T16:40:09.190Z',
    });
    expect(service).toBeDefined();
  });
});
