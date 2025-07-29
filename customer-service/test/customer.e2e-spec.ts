import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect } from 'mongoose';

describe('Customer Service (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    }, 30000); // 👈 Increase timeout here

    afterEach(async () => {
        // Optional: close connections between tests
        jest.clearAllMocks();
    });

    afterAll(async () => {
        if (app) {
            await app.close();
        }
        await disconnect();
    }, 10000); // optional timeout here

    it('should create a customer', () => {
        const mutation = `
      mutation {
        createCustomer(createCustomerInput: {
          name: "Test User",
          email: "testuser@example.com"
        }) {
          _id
          name
        }
      }
    `;

        return request(app.getHttpServer())
            .post('/graphql')
            .send({ query: mutation })
            .expect(200)
            .expect(res => {
                expect(res.body.data.createCustomer.name).toBe('Test User');
            });
    });

    it('should fetch all customers', () => {
        const query = `
      query {
        findAllCustomers {
          _id
          name
        }
      }
    `;

        return request(app.getHttpServer())
            .post('/graphql')
            .send({ query })
            .expect(200)
            .expect(res => {
                expect(res.body.data.findAllCustomers.length).toBeGreaterThan(0);
            });
    });
});
