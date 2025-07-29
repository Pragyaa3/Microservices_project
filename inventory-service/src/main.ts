import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for frontend on port 3002
  app.enableCors({
    origin: 'http://localhost:3002',
    methods: ['GET', 'POST', 'OPTIONS'],
  });

  // RabbitMQ microservice connection
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'inventory_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('📦 Inventory service running on port 3000');
}
bootstrap();
