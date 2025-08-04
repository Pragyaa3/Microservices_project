'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { inventoryClient } from '@/lib/apollo-client';
import { GET_PRODUCTS, CREATE_PRODUCT } from '@/lib/graphql/queries';
import { Product, CreateProductInput } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { PlusIcon, CubeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateProductInput>({
    name: '',
    price: 0,
    stock: 0,
  });

  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
    client: inventoryClient,
  });

  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT, {
    client: inventoryClient,
    onCompleted: () => {
      toast.success('Product created successfully!');
      setShowCreateForm(false);
      setFormData({ name: '', price: 0, stock: 0 });
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0 || formData.stock < 0) {
      toast.error('Please fill all fields with valid values');
      return;
    }
    
    createProduct({
      variables: {
        createProductInput: formData,
      },
    });
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  const products: Product[] = data?.getProducts || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Product</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter stock quantity"
                min="0"
                required
              />
            </div>
            <div className="md:col-span-3 flex space-x-3">
              <button
                type="submit"
                disabled={creating}
                className="btn-primary disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow p-6 card-hover">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <CubeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600">ID: {product._id.slice(-6)}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-bold text-green-600">₹{product.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stock:</span>
                <span className={`font-medium ${
                  product.stock > 10 ? 'text-green-600' : 
                  product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {product.stock} units
                </span>
              </div>
            </div>

            {product.stock === 0 && (
              <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 font-medium">Out of Stock</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first product</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create Product
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;