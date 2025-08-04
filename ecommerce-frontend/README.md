# E-Commerce Frontend

A modern React/Next.js frontend for the E-Commerce Management System with GraphQL integration.

## Features

✅ **Dashboard** - Overview with real-time statistics
✅ **Product Management** - Create, view, and manage products
✅ **Customer Management** - Handle customer profiles and information
✅ **Order Management** - Create and track orders
✅ **Shopping Cart** - Add products to cart and checkout
✅ **Responsive Design** - Mobile-friendly interface
✅ **Real-time Updates** - GraphQL queries with error handling
✅ **Toast Notifications** - User feedback for all actions

## Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **GraphQL Client**: Apollo Client
- **Icons**: Heroicons
- **Notifications**: React Hot Toast
- **Forms**: React Hook Form

## Prerequisites

- Node.js 18+ installed
- Backend services running:
  - Inventory Service on port 3000
  - Customer Service on port 3001
- MongoDB database connected
- RabbitMQ (optional for full functionality)

## Setup Instructions

### 1. Clone and Install
```bash
git clone <repository-url>
cd ecommerce-frontend
npm install