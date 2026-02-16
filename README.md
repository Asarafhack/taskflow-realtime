# TaskFlow — Real-Time Collaborative Task Management Platform

A full-stack collaborative task board with live synchronization, activity tracking, and smart productivity features. Built as a lightweight Trello + Notion hybrid.

## Architecture

```
┌──────────────────────────────────┐
│         React Frontend           │
│  Vite + Tailwind + Zustand       │
│  dnd-kit + Framer Motion         │
└──────────┬───────────────────────┘
           │ REST API + WebSocket
           ▼
┌──────────────────────────────────┐
│      Express.js Backend          │
│  JWT Auth + Socket.io            │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│         MongoDB Atlas            │
│  Mongoose ODM                    │
└──────────────────────────────────┘
```

## Database Schema

```
┌─────────┐       ┌─────────┐       ┌─────────┐       ┌─────────┐
│  User   │──────▶│  Board  │──────▶│  List   │──────▶│  Task   │
│─────────│ 1:N   │─────────│ 1:N   │─────────│ 1:N   │─────────│
│ name    │       │ title   │       │ title   │       │ title   │
│ email   │       │ members │       │ boardId │       │ desc    │
│ password│       │ color   │       │ position│       │ listId  │
│ created │       │ created │       │         │       │ assigned│
└─────────┘       └─────────┘       └─────────┘       │ priority│
                       │                               │ position│
                       │                               │ complete│
                       ▼                               └────┬────┘
                  ┌─────────┐                               │
                  │Activity │                          ┌────▼────┐
                  │─────────│                          │  Task   │
                  │ userId  │                          │ History │
                  │ action  │                          │─────────│
                  │ boardId │                          │ taskId  │
                  │ created │                          │ change  │
                  └─────────┘                          │ prev    │
                                                       │ new     │
                                                       │ changedBy│
                                                       │ timestamp│
                                                       └─────────┘
```

### Indexes

- `User.email` — unique, fast login lookup
- `Task.listId` — query tasks by list
- `Activity.boardId` — query activity feed
- `TaskHistory.taskId` — query audit log

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| State | Zustand (persist middleware) |
| Drag & Drop | dnd-kit |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT (bcryptjs) |
| Realtime | Socket.io |
| Testing | Jest, Supertest |

## API Contract

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/auth/register` | POST | `{ name, email, password }` | `{ token, user }` |
| `/auth/login` | POST | `{ email, password }` | `{ token, user }` |
| `/boards` | GET | — | `Board[]` |
| `/boards` | POST | `{ title }` | `Board` |
| `/boards/:id` | GET | — | `Board` |
| `/boards/:id/add-member` | POST | `{ email }` | `Board` |
| `/lists` | POST | `{ title, boardId }` | `List` |
| `/tasks` | POST | `{ title, listId }` | `Task` |
| `/tasks/:id` | PUT | `Partial<Task>` | `Task` |
| `/tasks/:id` | DELETE | — | `{ message }` |
| `/tasks/:id/assign` | POST | `{ userId }` | `Task` |
| `/tasks/search?q=` | GET | — | `Task[]` |
| `/tasks?page=&limit=` | GET | — | `{ tasks, total, page }` |
| `/tasks/completed?date=` | GET | — | `Task[]` |
| `/activity?boardId=` | GET | — | `Activity[]` |

## Real-Time Sync Strategy

```
Frontend                    Backend
   │                           │
   ├── socket.join(boardId) ──▶│ joins socket room
   │                           │
   ├── task CRUD action ──────▶│ saves to DB
   │                           │
   │◀── io.to(boardId).emit ──┤ broadcasts "refresh"
   │                           │
   └── refetchBoard() ────────▶│ GET latest data
```

- Socket rooms per board — only relevant users receive updates
- Presence tracking: `user-joined` / `user-left` events
- Soft lock: `task-lock` / `task-unlock` during drag operations
- Optimistic UI: frontend updates instantly, backend confirms

## Innovative Features

### Presence Indicator
Live avatars of users currently viewing the board via Socket.io room tracking.

### Soft Lock While Dragging
When a user drags a task, other users see it as locked — prevents edit conflicts.

### Task Priority + Color Tags
Each task has priority (High/Medium/Low) with visual indicators and optional color labels.

### Completed Timeline
Tasks grouped by completion date — "Today", "Yesterday", etc. Enterprise-grade campaign tracking.

### Task Audit History
Every change to a task is logged: title, description, priority, assignments, list moves. Full audit trail per task.

### Task Filters
Filter tasks by priority, assigned member, and completion status directly on the board view.

### Board Member Management
Invite team members to boards by email with real-time roster updates.

### Recent Boards
Last 5 visited boards stored client-side for quick navigation.

### Activity Feed with Filters
Filterable activity log per board showing all CRUD operations with timestamps.

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

### Environment Variables

```env
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
```

### Demo Credentials

```
Email: alex@example.com
Password: password
```

## Scalability Considerations

### Horizontal Scaling
- **Redis Pub/Sub** for Socket.io adapter — enables multiple Node instances to share WebSocket connections
- **Load balancer** (Nginx/ALB) distributes HTTP and WebSocket traffic across backend replicas
- **Sticky sessions** or Redis adapter ensures Socket.io connections persist across instances

### Database Optimization
- **MongoDB indexes** on `email`, `listId`, `boardId`, `taskId` for O(log n) lookups
- **Connection pooling** via Mongoose for efficient DB connection reuse
- **Aggregation pipelines** for complex queries (completed tasks by date, activity feeds)

### Frontend Performance
- **CDN deployment** (Vercel/Cloudflare) for global edge caching of static assets
- **Optimistic UI updates** — instant feedback, background sync with rollback on failure
- **Zustand persist** — localStorage caching reduces initial API calls
- **Code splitting** via Vite dynamic imports for route-based lazy loading

### Monitoring
- **Health endpoint** (`GET /health`) for uptime monitoring
- **Structured logging** for request tracing and error tracking
- **Rate limiting** middleware to prevent API abuse

## Assumptions & Trade-offs

1. **Optimistic updates**: Frontend updates immediately; if backend fails, data persists in localStorage until next sync
2. **Mock fallback**: When backend is unavailable, the app runs with mock data for demo purposes
3. **No refresh tokens**: Single JWT for simplicity; production would add refresh token rotation
4. **Client-side presence**: Presence indicators update via Socket.io; no server-side session persistence
5. **Single board room**: Each board is a separate socket room; cross-board notifications not implemented
#   t a s k f l o w - r e a l t i m e  
 