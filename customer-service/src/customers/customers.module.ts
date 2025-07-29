import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersService } from './customers.service';
import { CustomersResolver } from './customers.resolver';
import { CustomersController } from './customers.controller';  // ← Add this import
import { Customer, CustomerSchema } from './schemas/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
  ],
  controllers: [CustomersController],  // ← Add this line
  providers: [
    CustomersService,
    CustomersResolver,
  ],
})
export class CustomersModule {}