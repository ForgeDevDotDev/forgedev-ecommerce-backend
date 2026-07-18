# ForgeDev E-commerce Backend

> Express + TypeScript + Prisma + SQLite — Storefront API with products, cart, orders, and inventory management

**Part of [ForgeDev](https://forgedev.dev)** — Structured work simulation for junior developers.

---

## 🛒 What's This?

A backend API for an e-commerce platform. Includes product catalog, shopping cart, checkout flow, order management, and stock dashboards.

This is a **training codebase** — it works, but it has intentional bugs, missing features, and messy patterns for you to find and fix.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database
npm run prisma:seed

# Start dev server
npm run dev
```

The API will be available at `http://localhost:3000`.

## 📋 API Endpoints

### Products
- `GET /api/products` — List products (supports `?page`, `?limit`, `?search`, `?categoryId`)
- `GET /api/products/:id` — Get product by ID
- `POST /api/products` — Create product
- `PUT /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product

### Cart
- `GET /api/cart?cartId=xxx` — Get or create cart
- `POST /api/cart/add` — Add item to cart
- `DELETE /api/cart/:itemId` — Remove item from cart
- `DELETE /api/cart/clear/:cartId` — Clear entire cart

### Orders
- `GET /api/orders` — List orders (paginated)
- `GET /api/orders/:id` — Get order by ID
- `POST /api/orders` — Create order from cart

### Categories
- `GET /api/categories` — List all categories
- `POST /api/categories` — Create category
- `PUT /api/categories/:id` — Update category
- `DELETE /api/categories/:id` — Delete category

### Inventory
- `GET /api/inventory` — List all inventory
- `GET /api/inventory/low-stock` — Get low-stock items
- `PUT /api/inventory/:productId` — Update stock

## 🗄 Tech Stack

- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database:** SQLite via Prisma ORM
- **Validation:** Zod (partially used)

## 📁 Project Structure

```
src/
├── index.ts          # Express app entry point
├── routes/           # API route handlers
│   ├── index.ts      # Route aggregator
│   ├── products.ts   # Product CRUD + search/filter
│   ├── cart.ts       # Cart operations
│   ├── orders.ts     # Order creation + listing
│   ├── categories.ts # Category CRUD
│   └── inventory.ts  # Stock management
├── middleware/        # Express middleware
├── models/           # Prisma client instance
├── utils/            # Helper functions
└── tests/            # Test files
prisma/
├── schema.prisma     # Database schema
└── seed.ts           # Seed data with Spanish e-commerce products
```

## ⚠️ Known Issues (Intentional)

This codebase has deliberate bugs and incomplete features for training purposes. Some things to look out for:

- Cart total calculation has a floating point rounding issue
- No stock validation on checkout (can order more than available)
- Inconsistent response formats (some `{data: ...}`, some return raw objects)
- Missing authentication middleware
- Dead `/wishlist` route that was started but never finished
- TODO: payment gateway not implemented
- Low stock threshold hardcoded instead of using per-product setting

## 🔗 Related Repositories

| Repo | Role |
|------|------|
| forgedev-ecommerce-vue | Vue 3 frontend |
| forgedev-ecommerce-react | React frontend |

---

## 📜 License

This project is dual-licensed. See [LICENSE](./LICENSE), [COMMERCIAL-LICENSE.md](./COMMERCIAL-LICENSE.md), and [CLA.md](./CLA.md).

**ForgeDev** — https://forgedev.dev
