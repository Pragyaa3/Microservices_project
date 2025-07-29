import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class Order extends Document {
  @Field(() => ID)
  declare _id: string;

  @Field()
  @Prop()
  productId: string;

  @Field()
  @Prop()
  customerId: string;

  @Field()
  @Prop()
  status: string;

  @Field()
  @Prop()
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
