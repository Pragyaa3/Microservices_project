import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private model: Model<CustomerDocument>) {
    console.log("📦 CustomersService ready and listening for events...");
  }

  async create(input: CreateCustomerInput) {
    console.log("🚨 INPUT RECEIVED:", input);

    if (!input.name || !input.email) {
      throw new Error("Missing name or email!");
    }

    return this.model.create({
      name: input.name,
      email: input.email,
      orderHistory: [],
    });
  }

  async update(id: string, input: UpdateCustomerInput) {
    return this.model.findByIdAndUpdate(id, input, { new: true });
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    return this.model.findById(id);
  }

  async addOrderToHistory(customerId: string, order: any) {
    return this.model.findOneAndUpdate(
      { _id: customerId },
      {
        $push: {
          orderHistory: {
            orderId: order.orderId,
            productId: order.productId,
            status: order.status,
          },
        },
      },
      { new: true }
    );
  }
}

