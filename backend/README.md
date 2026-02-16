# TaskFlow Backend

Real-Time Collaborative Task Management API

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs
- **Realtime**: Socket.io

## Architecture

```
Client ←→ Express API ←→ MongoDB
  ↕
Socket.io (real-time sync)
```

### Database Schema

```
User → Board → List → Task
                        ↓
                   TaskHistory
         ↓
      Activity
```

### Indexes

| Collection | Index | Purpose |
|------------|-------|---------|
| User | email | Fast login lookup |
| Task | listId | Board rendering |
| Task | completed + completedAt | Timeline queries |
| Activity | boardId + createdAt | Feed pagination |
| TaskHistory | taskId + timestamp | Audit trail |

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login, returns JWT |
| GET | /boards | List user boards |
| POST | /boards | Create board |
| GET | /boards/:id | Board details |
| POST | /lists | Create list |
| GET | /lists?boardId= | Lists for board |
| POST | /tasks | Create task |
| PUT | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |
| POST | /tasks/:id/assign | Assign user |
| GET | /tasks?listId=&page=&limit= | Paginated tasks |
| GET | /tasks/search?q= | Search tasks |
| GET | /tasks/completed?date= | Completed by date |
| GET | /tasks/history/:taskId | Task change history |
| GET | /activity?boardId= | Activity feed |
| POST | /activity | Log activity |

## Real-Time Events

| Event | Direction | Description |
|-------|-----------|-------------|
| join-board | Client → Server | Join board room |
| task-change | Client → Server | Notify task update |
| refresh | Server → Client | Refetch board data |
| task-lock | Client → Server | Lock task during drag |
| task-locked | Server → Client | Notify lock |
| task-unlock | Client → Server | Release lock |
| task-unlocked | Server → Client | Notify unlock |
| presence-update | Server → Client | Online users list |

## Demo Credentials

```
Email: alex@example.com
Password: password123
```

## Scalability Considerations

- **Redis Pub/Sub**: Replace in-memory socket rooms with Redis adapter for horizontal scaling
- **MongoDB Indexes**: Compound indexes on hot queries
- **Horizontal Scaling**: Stateless JWT auth enables multi-instance deployment
- **CDN Frontend**: Static assets served via CDN
- **Load Balancer**: Sticky sessions for Socket.io with Redis adapter
- **Rate Limiting**: Express-rate-limit on auth endpoints
- **Connection Pooling**: Mongoose connection pool for concurrent requests

## Tests

```bash
npm test
```
