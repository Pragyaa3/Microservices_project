import { gql } from '@apollo/client';

// Inventory Service Queries
export const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      _id
      name
      price
      stock
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders {
    getOrders {
      _id
      productId
      customerId
      status
      createdAt
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($createProductInput: CreateProductInput!) {
    createProduct(createProductInput: $createProductInput) {
      _id
      name
      price
      stock
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($createOrderInput: CreateOrderInput!) {
    createOrder(createOrderInput: $createOrderInput) {
      _id
      productId
      customerId
      status
      createdAt
    }
  }
`;

// Customer Service Queries
export const GET_CUSTOMERS = gql`
  query FindAllCustomers {
    findAllCustomers {
      _id
      name
      email
    }
  }
`;

export const GET_CUSTOMER = gql`
  query FindCustomer($id: String!) {
    findCustomer(id: $id) {
      _id
      name
      email
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($createCustomerInput: CreateCustomerInput!) {
    createCustomer(createCustomerInput: $createCustomerInput) {
      _id
      name
      email
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($updateCustomerInput: UpdateCustomerInput!) {
    updateCustomer(updateCustomerInput: $updateCustomerInput) {
      _id
      name
      email
    }
  }
`;