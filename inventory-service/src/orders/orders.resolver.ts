import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.schema';
import { CreateOrderInput } from './dto/create-order.input';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ): Promise<Order> {
    return this.ordersService.create(createOrderInput);
  }

  @Query(() => [Order])
  getOrders(): Promise<Order[]> {
    return this.ordersService.findAll();
  }
}
