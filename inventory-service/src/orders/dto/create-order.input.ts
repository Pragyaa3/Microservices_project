import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field()
  productId: string;

  @Field()
  customerId: string;
}
