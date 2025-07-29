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
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'customer_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  try {
    await app.startAllMicroservices();
    console.log('🚀 Customer microservice started successfully');
  } catch (error) {
    console.error('❌ Failed to start microservice:', error);
  }

  await app.listen(3001);
  console.log('🌐 Customer service HTTP server running on port 3001');
}
bootstrap();
