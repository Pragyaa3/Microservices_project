'use client';
import { useQuery } from '@apollo/client';
import { inventoryClient, customerClient } from '@/lib/apollo-client';
import { GET_PRODUCTS, GET_CUSTOMERS, GET_ORDERS } from '@/lib/graphql/queries';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import {
  CubeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts
  } = useQuery(GET_PRODUCTS, { client: inventoryClient });

  const {
    data: customersData,
    loading: customersLoading,
    error: customersError,
    refetch: refetchCustomers
  } = useQuery(GET_CUSTOMERS, { client: customerClient });

  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders
  } = useQuery(GET_ORDERS, { client: inventoryClient });

  if (productsLoading || customersLoading || ordersLoading) {
    return <LoadingSpinner size="large" />;
  }

  if (productsError) {
    return <ErrorMessage message={productsError.message} onRetry={refetchProducts} />;
  }

  if (customersError) {
    return <ErrorMessage message={customersError.message} onRetry={refetchCustomers} />;
  }

  if (ordersError) {
    return <ErrorMessage message={ordersError.message} onRetry={refetchOrders} />;
  }

  const products = productsData?.getProducts || [];
  const customers = customersData?.findAllCustomers || [];
  const orders = ordersData?.getOrders || [];

  const totalRevenue = orders.reduce((sum: number, order: any) => {
    const product = products.find((p: any) => p._id === order.productId);
    return sum + (product?.price || 0);
  }, 0);

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: CubeIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Customers',
      value: customers.length,
      icon: UserGroupIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: ClipboardDocumentListIcon,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue}`,
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-5">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your E-Commerce Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-5 card-hover">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Products</h3>
          <div className="space-y-3">
            {products.slice(0, 5).map((product: any) => (
              <div key={product._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                </div>
                <p className="font-bold text-green-600">₹{product.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order: any) => (
              <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                  }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;