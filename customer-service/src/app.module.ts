import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    MongooseModule.forRoot('mongodb+srv://pragyahurmade2226:toabvh5SCo1cUCSO@medisync-cluster.ebsed.mongodb.net/customer-db?retryWrites=true&w=majority&appName=Medisync-cluster'),
    CustomersModule,
  ],
})
export class AppModule {}
