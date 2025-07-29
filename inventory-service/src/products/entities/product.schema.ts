import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class Product extends Document {
    @Field(() => ID)
    declare _id: string;

    @Field()
    @Prop()
    name: string;

    @Field(() => Int)
    @Prop()
    price: number;

    @Field(() => Int)
    @Prop()
    stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
