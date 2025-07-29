import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CustomersService } from './customers.service';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { CustomerType } from './dto/customer.type';
import { CustomerDocument } from './schemas/customer.schema';

@Resolver(() => CustomerType)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Mutation(() => CustomerType)
  async createCustomer(@Args('createCustomerInput') input: CreateCustomerInput) {
    const created = await this.customersService.create(input);
    const customer = created as CustomerDocument;

    return {
      _id: customer._id?.toString() || '',
      name: customer.name,
      email: customer.email,
    };
  }

  @Mutation(() => CustomerType)
  async updateCustomer(@Args('updateCustomerInput') input: UpdateCustomerInput) {
    const updated = await this.customersService.update(input.id, input);
    if (!updated) throw new Error('Customer not found');

    const customer = updated as CustomerDocument;

    return {
      _id: customer._id?.toString() || '',
      name: customer.name,
      email: customer.email,
    };
  }

  @Query(() => [CustomerType])
  async findAllCustomers() {
    const all = await this.customersService.findAll();
    return all.map((user) => {
      const customer = user as CustomerDocument;
      return {
        _id: customer._id?.toString() || '',
        name: customer.name,
        email: customer.email,
      };
    });
  }

  @Query(() => CustomerType)
  async findCustomer(@Args('id') id: string) {
    const user = await this.customersService.findOne(id);
    if (!user) throw new Error('Customer not found');

    const customer = user as CustomerDocument;

    return {
      _id: customer._id?.toString() || '',
      name: customer.name,
      email: customer.email,
    };
  }
}
