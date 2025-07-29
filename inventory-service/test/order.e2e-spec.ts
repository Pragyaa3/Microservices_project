import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Order (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create an order and return order data', async () => {
    const mutation = `
      mutation {
        createOrder(createOrderInput: {
          productId: "abc123"
          customerId: "cust001"
        }) {
          _id
          status
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation });

    expect(res.body.data.createOrder).toHaveProperty('_id');
    expect(res.body.data.createOrder.status).toBe('PENDING');
  });
});
