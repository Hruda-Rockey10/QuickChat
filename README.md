# QuickChat 💬

A real-time chat application built with Next.js, Express, Socket.IO, Kafka, and Redis. Features scalable architecture with message persistence, authentication, and automated testing.

![CI Status](https://github.com/Hruda-Rockey10/QuickChat/actions/workflows/ci.yml/badge.svg)

## ✨ Features

- **Real-time Messaging** - Instant message delivery using Socket.IO
- **Group Chat** - Create and join password-protected chat groups
- **Message Persistence** - Messages stored in PostgreSQL via Kafka
- **Authentication** - Google OAuth integration with NextAuth.js
- **Horizontal Scaling** - Redis adapter enables multi-server Socket.IO
- **Modern Infrastructure** - Kafka in KRaft mode (no Zookeeper needed)
- **Automated Testing** - Jest unit tests with 100% pass rate
- **CI/CD Pipeline** - GitHub Actions runs tests on every push

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │ (Next.js 16 + TypeScript)
│  (Port 3000)│
└──────┬──────┘
       │ HTTP + Socket.IO
       ↓
┌─────────────┐      ┌─────────────┐
│   Server    │─────→│    Redis    │ (Socket Adapter)
│  (Port 8000)│      │  (Port 6379)│
└──────┬──────┘      └─────────────┘
       │
       ├─────→ Kafka (KRaft) ─────→ Consumer ─────→ PostgreSQL
       │      (Port 9092)                          (Port 5432)
       │
       └─────→ Direct Broadcast (Fast Path)
```

### Message Flow

1. **Fast Path**: Client → Socket.IO → Broadcast to other clients (instant)
2. **Safe Path**: Socket.IO → Kafka → Consumer → PostgreSQL (persistent)

This dual-path approach ensures both real-time UX and data durability.

## 🚀 Tech Stack

### Client

- **Next.js 16** - React framework with Turbopack
- **TypeScript** - Type safety
- **NextAuth.js** - Authentication
- **Socket.IO Client** - Real-time communication
- **Zustand** - State management
- **TailwindCSS** - Styling

### Server

- **Express** - Web framework
- **Socket.IO** - WebSocket server
- **Kafka (KRaft)** - Message queue (no Zookeeper!)
- **Redis** - Socket.IO adapter for scaling
- **Prisma** - ORM for PostgreSQL
- **Jest + Supertest** - Testing

### Infrastructure

- **PostgreSQL** - Primary database
- **Apache Kafka** - Event streaming (KRaft mode)
- **Redis** - Pub/Sub for Socket.IO
- **Docker Compose** - Local development

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Hruda-Rockey10/QuickChat.git
   cd QuickChat
   ```

2. **Install dependencies**

   ```bash
   # Server
   cd server
   npm install

   # Client
   cd ../client
   npm install
   ```

3. **Setup environment variables**

   **Server** (`server/.env`):

   ```env
   PORT=8000
   DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/quickchat?schema=public"
   REDIS_URL="redis://localhost:6379"
   KAFKA_BROKERS="localhost:9092"
   KAFKA_TOPIC="chats"
   JWT_SECRET="your-secret-key"
   CLIENT_URL="http://localhost:3000"
   KAFKAJS_NO_PARTITIONER_WARNING=1
   ```

   **Client** (`client/.env.local`):

   ```env
   NEXT_PUBLIC_SERVER_URL="http://localhost:8000"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Start infrastructure services**

   ```bash
   cd server
   docker-compose up -d
   ```

   This starts:

   - PostgreSQL (port 5432)
   - Redis (port 6379)
   - Kafka in KRaft mode (port 9092)

5. **Run database migrations**

   ```bash
   cd server
   npx prisma migrate dev
   ```

6. **Start the application**

   **Terminal 1 - Server:**

   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Client:**

   ```bash
   cd client
   npm run dev
   ```

7. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Run Tests

```bash
cd server
npm test
```

### Test Coverage

- **Server Smoke Test**: Verifies server is running
- **JoinGroup Tests**: Tests authentication logic (404, 401, 200 scenarios)
- Uses mocked Prisma/Kafka for isolated unit tests

### CI/CD

Tests run automatically on every push via GitHub Actions:

- `.github/workflows/ci.yml`
- View results: [GitHub Actions](https://github.com/Hruda-Rockey10/QuickChat/actions)

## 📂 Project Structure

```
QuickChat/
├── client/                # Next.js frontend
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks (useChatSocket)
│   │   └── store/        # Zustand stores
│   └── package.json
│
├── server/               # Express backend
│   ├── src/
│   │   ├── __tests__/   # Jest tests
│   │   ├── config/      # DB, Redis, Kafka config
│   │   ├── consumers/   # Kafka consumers
│   │   ├── controllers/ # Route handlers
│   │   ├── middlewares/ # Auth middleware
│   │   ├── routes/      # API routes
│   │   └── index.ts     # Server entry point
│   ├── prisma/          # Database schema
│   ├── docker-compose.yml
│   └── package.json
│
└── .github/
    └── workflows/
        └── ci.yml       # GitHub Actions CI/CD
```

## 🔑 Key Features Explained

### Real-time Chat

- **Socket.IO** maintains persistent WebSocket connections
- **Optimistic UI updates** for instant feedback
- **Room-based messaging** for group isolation

### Horizontal Scaling

- **Redis Pub/Sub** enables multiple server instances
- Socket.IO adapter broadcasts events across servers
- Supports load balancing

### Message Persistence

- **Kafka** decouples real-time delivery from database writes
- **Consumer** processes messages asynchronously
- **PostgreSQL** stores chat history

### Authentication

- **Google OAuth** via NextAuth.js
- **JWT tokens** for API authorization
- **Passcode protection** for chat groups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Hrudananda Sahoo**

- GitHub: [@Hruda-Rockey10](https://github.com/Hruda-Rockey10)

---

⭐ Star this repo if you find it helpful!
