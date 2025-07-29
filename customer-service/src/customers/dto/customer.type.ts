import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('CustomerType')
export class CustomerType {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  email: string;
}
