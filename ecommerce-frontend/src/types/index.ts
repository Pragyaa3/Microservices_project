export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Order {
  _id: string;
  productId: string;
  customerId: string;
  status: string;
  createdAt: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
}

export interface CreateOrderInput {
  productId: string;
  customerId: string;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
}

export interface UpdateCustomerInput {
  id: string;
  name?: string;
  email?: string;
}