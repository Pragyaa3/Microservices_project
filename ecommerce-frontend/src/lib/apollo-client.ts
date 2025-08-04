import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Inventory Service Client (Port 3000)
const inventoryHttpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

// Customer Service Client (Port 3001)
const customerHttpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

// Inventory Client
export const inventoryClient = new ApolloClient({
  link: inventoryHttpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
  },
});

// Customer Client
export const customerClient = new ApolloClient({
  link: customerHttpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
  },
});