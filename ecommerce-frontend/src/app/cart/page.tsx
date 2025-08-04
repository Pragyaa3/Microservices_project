// src/app/cart/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { inventoryClient, customerClient } from '@/lib/apollo-client';
import { GET_PRODUCTS, GET_CUSTOMERS, CREATE_ORDER } from '@/lib/graphql/queries';
import { Product, Customer, CartItem } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { 
  ShoppingCartIcon, 
  PlusIcon, 
  MinusIcon, 
  TrashIcon,
  CreditCardIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const { data: productsData, loading: productsLoading, error: productsError } = useQuery(GET_PRODUCTS, {
    client: inventoryClient,
  });

  const { data: customersData, loading: customersLoading, error: customersError } = useQuery(GET_CUSTOMERS, {
    client: customerClient,
  });

  const [createOrder, { loading: processingOrder }] = useMutation(CREATE_ORDER, {
    client: inventoryClient,
    onCompleted: () => {
      toast.success('Order placed successfully!');
      // Clear cart after successful order
      setCartItems([]);
      setShowCheckout(false);
      setSelectedCustomerId('');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  // Initialize empty cart
  useEffect(() => {
    setCartItems([]);
  }, []);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product._id === product._id);
      
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          toast.error('Not enough stock available');
          return prevItems;
        }
        return prevItems.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { product, quantity: 1 }];
      }
    });
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product._id !== productId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = cartItems.find(item => item.product._id === productId);
    if (item && newQuantity > item.product.stock) {
      toast.error('Not enough stock available');
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!selectedCustomerId) {
      toast.error('Please select a customer');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    // Process each cart item as a separate order
    try {
      for (const item of cartItems) {
        for (let i = 0; i < item.quantity; i++) {
          await createOrder({
            variables: {
              createOrderInput: {
                productId: item.product._id,
                customerId: selectedCustomerId,
              },
            },
          });
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (productsLoading || customersLoading) {
    return <LoadingSpinner size="large" />;
  }

  if (productsError || customersError) {
    return <ErrorMessage message="Error loading data" />;
  }

  const products: Product[] = productsData?.getProducts || [];
  const customers: Customer[] = customersData?.findAllCustomers || [];
  const availableProducts = products.filter(p => p.stock > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600">Add products to cart and place orders</p>
      </div>

      {/* Available Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableProducts.map((product) => (
            <div key={product._id} className="border border-gray-200 rounded-lg p-4 card-hover">
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-2">Stock: {product.stock} units</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-600">₹{product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="btn-primary text-sm py-1 px-3"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Cart Items ({getTotalItems()})
          </h3>
          {cartItems.length > 0 && (
            <button
              onClick={() => setShowCheckout(!showCheckout)}
              className="btn-primary flex items-center space-x-2"
            >
              <CreditCardIcon className="w-5 h-5" />
              <span>Checkout</span>
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600">Add some products to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.product._id} className="p-6 flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">₹{item.product.price} each</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                    disabled={item.quantity >= item.product.stock}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                  
                  <span className="w-20 text-right font-medium text-green-600">
                    ₹{item.product.price * item.quantity}
                  </span>
                  
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="p-6 bg-gray-50">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total: ₹{getTotalPrice()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Form */}
      {showCheckout && cartItems.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Checkout</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Customer
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a customer...</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Summary
              </label>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between text-sm">
                  <span>Items ({getTotalItems()}):</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                onClick={handleCheckout}
                disabled={processingOrder || !selectedCustomerId}
                className="w-full btn-primary disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <CreditCardIcon className="w-5 h-5" />
                <span>
                  {processingOrder ? 'Processing...' : `Place Order - ₹${getTotalPrice()}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;