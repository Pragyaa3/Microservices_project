'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingCartIcon, 
  UserGroupIcon, 
  CubeIcon, 
  ClipboardDocumentListIcon,
  HomeIcon 
} from '@heroicons/react/24/outline';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: HomeIcon },
    { href: '/products', label: 'Products', icon: CubeIcon },
    { href: '/customers', label: 'Customers', icon: UserGroupIcon },
    { href: '/orders', label: 'Orders', icon: ClipboardDocumentListIcon },
    { href: '/cart', label: 'Cart', icon: ShoppingCartIcon },
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              E-Commerce System
            </Link>
          </div>
          
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;