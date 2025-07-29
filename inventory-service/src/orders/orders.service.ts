import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { Order } from './entities/order.schema';
import { CreateOrderInput } from './dto/create-order.input';

@Injectable()
export class OrdersService {
  private client: ClientProxy;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'], // ✅ your RabbitMQ instance
        queue: 'customer_queue',
        queueOptions: { durable: false },
      },
    });
  }

  async create(createOrderInput: CreateOrderInput): Promise<Order> {
  const newOrder = new this.orderModel({
    ...createOrderInput,
    status: 'PENDING',
    createdAt: new Date(),
  });

  const savedOrder = await newOrder.save();
  console.log('💾 Order saved:', savedOrder);

  const eventData = {
    orderId: savedOrder._id.toString(),
    customerId: savedOrder.customerId,
    productId: savedOrder.productId,
    status: savedOrder.status,
  };

  console.log('📤 About to emit event with data:', eventData);

   try {
    // Connect to RabbitMQ first
    await this.client.connect();
    console.log('🔗 Connected to RabbitMQ');

    // Emit the event
    this.client.emit('order_created', eventData);
    console.log('✅ Event emitted successfully');
  } catch (error) {
    console.error('❌ Error emitting event:', error);
  }

  return savedOrder;
}

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }
}
