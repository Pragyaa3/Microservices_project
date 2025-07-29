import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: [] })
  orderHistory: {
    orderId: string;
    productId: string;
    status: string;
  }[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
