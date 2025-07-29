import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  stock: number;
}
