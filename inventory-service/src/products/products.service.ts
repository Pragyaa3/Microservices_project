import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.schema';
import { CreateProductInput } from './dto/create-product.input';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const newProduct = new this.productModel(createProductInput);
    return newProduct.save();
  }
}
