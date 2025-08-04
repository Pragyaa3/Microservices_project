# 🛒 Microservices-Based E-Commerce System

A fully containerized microservices architecture for an e-commerce platform — built using NestJS, GraphQL, MongoDB, RabbitMQ, and Docker Compose.

---

## 🚀 Project Highlights

- **Inventory Service**: Manages product data, stock levels, and product listings.
- **Customer Service**: Handles customer profiles and order histories.
- **Frontend**: Clean UI built in Next.js, consuming GraphQL APIs.
- **RabbitMQ**: Message broker enabling async communication between services.
- **GraphQL APIs**: Well-structured schema with queries & mutations for customers and inventory.
- **Docker Compose**: Spins up all services in one command for local development.

---

## 🧰 Tech Stack

| Layer        | Stack                                       |
| ------------ | ------------------------------------------- |
| Backend      | NestJS, GraphQL, MongoDB, RabbitMQ          |
| Frontend     | Next.js, Apollo Client                      |
| Messaging    | RabbitMQ (via `amqplib`)                    |
| DevOps       | Docker, Docker Compose                      |

---

## 📦 Services Overview

### 🧾 Inventory Service
- **Port**: 3000
- **MongoDB connection**
- **Exposes GraphQL schema for**:
 - Products
 - Stock updates

### 👤 Customer Service
- **Port**: 3001
- **MongoDB connection**
- **GraphQL schema for**:
 - Customer profiles
 - Order history

### 🖥️ Frontend (ecommerce-frontend)
- **Port**: 3002
- **Apollo Client with GraphQL integration**
- **Clean UI to display products, customers, and order history**

### 🐇 Message Queue (RabbitMQ)
- **Exposed at**:
 - `5672` for services
 - `15672` for web dashboard
- **URL**: http://localhost:15672
- **Default credentials**: `guest` / `guest`

---

## ▶️ Running the App

Make sure Docker is installed and running.

```bash
# Clone the repo
git clone https://github.com/yourusername/microservices-project.git
cd microservices-project

# Start everything
docker-compose up --build

**Then visit**:
- **Inventory GraphQL Playground** → http://localhost:3000/graphql
- **Customer GraphQL Playground** → http://localhost:3001/graphql
- **Frontend App** → http://localhost:3002
```
---

## 🤓 Author

**Pragya Hurmade**  
[LinkedIn](https://www.linkedin.com/in/pragyahurmade03/) • [GitHub](https://github.com/Pragyaa3)

---

## 🧠 Fun Fact

Built with more caffeine than code. ☕️
