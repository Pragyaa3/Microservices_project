import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // ✅ MongoDB connection
    MongooseModule.forRoot('mongodb+srv://pragyahurmade2226:toabvh5SCo1cUCSO@medisync-cluster.ebsed.mongodb.net/inventory-db?retryWrites=true&w=majority&appName=Medisync-cluster'),

    // ✅ GraphQL setup
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),

    // ✅ Your Products feature
    ProductsModule,

    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
