import supertest from 'supertest';
import { app } from '../src/app';

const api = supertest(app);
const BASE_URL = '/api/v1/territories';

describe('api/v1/territories end point should', () => {
  test('get list of territories', async () => {
    const expectedResult = {};
    const response = await api.get(BASE_URL);
    expect(response.body).toBe(expectedResult);
  });
});
