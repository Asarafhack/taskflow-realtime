import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Board, TaskList, Task, Activity, User, Priority, ColorTag, TaskHistoryEntry } from '@/types';
import { api } from '@/services/api';

const generateId = () => Math.random().toString(36).substring(2, 11);

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Chen', email: 'alex@example.com' },
  { id: 'u2', name: 'Sara Kim', email: 'sara@example.com' },
  { id: 'u3', name: 'James Wu', email: 'james@example.com' },
  { id: 'u4', name: 'Maya Patel', email: 'maya@example.com' },
];

const INITIAL_BOARDS: Board[] = [
  { id: 'b1', title: 'Product Launch', members: ['u1', 'u2', 'u3'], createdAt: '2026-02-10T08:00:00Z', color: 'blue' },
  { id: 'b2', title: 'Mobile App v2', members: ['u1', 'u4'], createdAt: '2026-02-12T10:00:00Z', color: 'green' },
  { id: 'b3', title: 'Marketing Campaign', members: ['u2', 'u3', 'u4'], createdAt: '2026-02-14T12:00:00Z', color: 'purple' },
];

const INITIAL_LISTS: TaskList[] = [
  { id: 'l1', title: 'Backlog', boardId: 'b1', position: 0 },
  { id: 'l2', title: 'To Do', boardId: 'b1', position: 1 },
  { id: 'l3', title: 'In Progress', boardId: 'b1', position: 2 },
  { id: 'l4', title: 'Done', boardId: 'b1', position: 3 },
  { id: 'l5', title: 'Backlog', boardId: 'b2', position: 0 },
  { id: 'l6', title: 'In Progress', boardId: 'b2', position: 1 },
  { id: 'l7', title: 'Review', boardId: 'b2', position: 2 },
  { id: 'l8', title: 'Done', boardId: 'b2', position: 3 },
];

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Design landing page', description: 'Create wireframes and high-fidelity mockups for the new landing page', listId: 'l1', assignedTo: ['u1'], priority: 'high', colorTag: 'red', position: 0, createdAt: '2026-02-10T09:00:00Z' },
  { id: 't2', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', listId: 'l2', assignedTo: ['u3'], priority: 'medium', colorTag: 'yellow', position: 0, createdAt: '2026-02-10T10:00:00Z' },
  { id: 't3', title: 'API documentation', description: 'Write comprehensive API docs using OpenAPI spec', listId: 'l2', assignedTo: ['u2'], priority: 'low', colorTag: 'blue', position: 1, createdAt: '2026-02-11T08:00:00Z' },
  { id: 't4', title: 'User authentication flow', description: 'Implement JWT-based auth with refresh tokens', listId: 'l3', assignedTo: ['u1', 'u3'], priority: 'high', colorTag: 'red', position: 0, createdAt: '2026-02-11T09:00:00Z' },
  { id: 't5', title: 'Database schema review', description: 'Review and optimize the current database schema', listId: 'l3', assignedTo: ['u2'], priority: 'medium', position: 1, createdAt: '2026-02-12T08:00:00Z' },
  { id: 't6', title: 'Logo design finalized', description: 'Final version of the product logo approved', listId: 'l4', assignedTo: ['u4'], priority: 'low', colorTag: 'green', position: 0, createdAt: '2026-02-09T08:00:00Z', completed: true, completedAt: '2026-02-12T10:00:00Z' },
  { id: 't7', title: 'Navigation component', description: 'Build responsive nav with mobile hamburger menu', listId: 'l5', assignedTo: ['u1'], priority: 'high', colorTag: 'purple', position: 0, createdAt: '2026-02-12T11:00:00Z' },
  { id: 't8', title: 'Push notifications', description: 'Integrate Firebase Cloud Messaging', listId: 'l6', assignedTo: ['u4'], priority: 'medium', colorTag: 'orange', position: 0, createdAt: '2026-02-13T09:00:00Z' },
  { id: 't9', title: 'App icon design', description: 'Create app icon in all required sizes', listId: 'l8', assignedTo: ['u4'], priority: 'low', colorTag: 'green', position: 0, createdAt: '2026-02-11T08:00:00Z', completed: true, completedAt: '2026-02-14T16:00:00Z' },
  { id: 't10', title: 'Onboarding screens', description: 'Design and implement 3-step onboarding flow', listId: 'l7', assignedTo: ['u1', 'u4'], priority: 'high', colorTag: 'blue', position: 0, createdAt: '2026-02-14T08:00:00Z' },
];

const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'a1', userId: 'u1', userName: 'Alex Chen', action: 'created task "Design landing page"', boardId: 'b1', timestamp: '2026-02-10T09:00:00Z' },
  { id: 'a2', userId: 'u3', userName: 'James Wu', action: 'moved "User auth flow" to In Progress', boardId: 'b1', timestamp: '2026-02-11T14:00:00Z' },
  { id: 'a3', userId: 'u4', userName: 'Maya Patel', action: 'completed "Logo design finalized"', boardId: 'b1', timestamp: '2026-02-12T10:00:00Z' },
  { id: 'a4', userId: 'u2', userName: 'Sara Kim', action: 'assigned to "API documentation"', boardId: 'b1', timestamp: '2026-02-13T08:00:00Z' },
  { id: 'a5', userId: 'u1', userName: 'Alex Chen', action: 'created "Navigation component"', boardId: 'b2', timestamp: '2026-02-12T11:00:00Z' },
  { id: 'a6', userId: 'u4', userName: 'Maya Patel', action: 'completed "App icon design"', boardId: 'b2', timestamp: '2026-02-14T16:00:00Z' },
];

const INITIAL_HISTORY: TaskHistoryEntry[] = [
  { id: 'h1', taskId: 't4', changeType: 'listId', previousValue: 'To Do', newValue: 'In Progress', changedByName: 'James Wu', timestamp: '2026-02-11T14:00:00Z' },
  { id: 'h2', taskId: 't4', changeType: 'assignedTo', previousValue: 'Alex Chen', newValue: 'Alex Chen, James Wu', changedByName: 'Alex Chen', timestamp: '2026-02-11T13:00:00Z' },
  { id: 'h3', taskId: 't6', changeType: 'completed', previousValue: 'false', newValue: 'true', changedByName: 'Maya Patel', timestamp: '2026-02-12T10:00:00Z' },
  { id: 'h4', taskId: 't1', changeType: 'priority', previousValue: 'medium', newValue: 'high', changedByName: 'Alex Chen', timestamp: '2026-02-10T12:00:00Z' },
];

interface BoardStore {
  currentUser: User;
  users: User[];
  boards: Board[];
  lists: TaskList[];
  tasks: Task[];
  activities: Activity[];
  taskHistory: TaskHistoryEntry[];
  recentBoardIds: string[];
  onlineUsers: Record<string, string[]>;
  searchQuery: string;
  isBackendConnected: boolean;

  setSearchQuery: (q: string) => void;
  addBoard: (title: string) => void;
  addList: (title: string, boardId: string) => void;
  addTask: (title: string, listId: string, boardId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string, boardId: string) => void;
  moveTask: (taskId: string, toListId: string, boardId: string) => void;
  completeTask: (taskId: string, boardId: string) => void;
  assignTask: (taskId: string, userId: string, boardId: string) => void;
  unassignTask: (taskId: string, userId: string) => void;
  addActivity: (action: string, boardId: string) => void;
  visitBoard: (boardId: string) => void;
  getListsByBoard: (boardId: string) => TaskList[];
  getTasksByList: (listId: string) => Task[];
  getFilteredTasksByList: (listId: string, filters: { priority?: Priority | null; assignee?: string | null; completed?: 'all' | 'active' | 'completed' }) => Task[];
  getActivitiesByBoard: (boardId: string) => Activity[];
  getCompletedTasksByDate: (date: string) => Task[];
  getTaskHistory: (taskId: string) => TaskHistoryEntry[];
  getUserById: (userId: string) => User | undefined;
  getBoardById: (boardId: string) => Board | undefined;
  fetchBoardData: (boardId: string) => Promise<void>;
  setCurrentUser: (user: User) => void;
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      currentUser: MOCK_USERS[0],
      users: MOCK_USERS,
      boards: INITIAL_BOARDS,
      lists: INITIAL_LISTS,
      tasks: INITIAL_TASKS,
      activities: INITIAL_ACTIVITIES,
      taskHistory: INITIAL_HISTORY,
      recentBoardIds: ['b1'],
      onlineUsers: { b1: ['u1', 'u2'], b2: ['u4'] },
      searchQuery: '',
      isBackendConnected: false,

      setSearchQuery: (q) => set({ searchQuery: q }),
      setCurrentUser: (user) => set({ currentUser: user }),

      fetchBoardData: async (boardId: string) => {
        try {
          const [activities] = await Promise.all([
            api.activity.getByBoard(boardId),
          ]);
          set({ activities: activities.map((a: any) => ({
            id: a._id || a.id,
            userId: a.user || a.userId,
            userName: a.userName || a.user,
            action: a.action,
            boardId: a.boardId,
            timestamp: a.createdAt || a.timestamp,
          })), isBackendConnected: true });
        } catch {
          set({ isBackendConnected: false });
        }
      },

      addBoard: (title) => {
        const id = generateId();
        const board: Board = { id, title, members: [get().currentUser.id], createdAt: new Date().toISOString() };
        set((s) => ({ boards: [...s.boards, board] }));
        get().addActivity(`created board "${title}"`, id);

        api.boards.create(title).then((res) => {
          set((s) => ({
            boards: s.boards.map((b) => b.id === id ? { ...b, id: res._id || res.id } : b),
          }));
        }).catch(() => {});
      },

      addList: (title, boardId) => {
        const lists = get().lists.filter((l) => l.boardId === boardId);
        const list: TaskList = { id: generateId(), title, boardId, position: lists.length };
        set((s) => ({ lists: [...s.lists, list] }));

        api.lists.create(title, boardId).then((res) => {
          set((s) => ({
            lists: s.lists.map((l) => l.id === list.id ? { ...l, id: res._id || res.id } : l),
          }));
        }).catch(() => {});
      },

      addTask: (title, listId, boardId) => {
        const tasks = get().tasks.filter((t) => t.listId === listId);
        const task: Task = {
          id: generateId(),
          title,
          description: '',
          listId,
          assignedTo: [],
          priority: 'medium',
          position: tasks.length,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ tasks: [...s.tasks, task] }));
        get().addActivity(`created task "${title}"`, boardId);

        api.tasks.create({ title, listId }).then((res) => {
          set((s) => ({
            tasks: s.tasks.map((t) => t.id === task.id ? { ...t, id: res._id || res.id } : t),
          }));
        }).catch(() => {});
      },

      updateTask: (taskId, updates) => {
        const existing = get().tasks.find((t) => t.id === taskId);
        if (existing) {
          const entries: TaskHistoryEntry[] = [];
          for (const key of Object.keys(updates) as (keyof Task)[]) {
            if (JSON.stringify(existing[key]) !== JSON.stringify(updates[key])) {
              entries.push({
                id: generateId(),
                taskId,
                changeType: key,
                previousValue: String(existing[key] ?? ''),
                newValue: String(updates[key] ?? ''),
                changedByName: get().currentUser.name,
                timestamp: new Date().toISOString(),
              });
            }
          }
          if (entries.length > 0) {
            set((s) => ({ taskHistory: [...entries, ...s.taskHistory] }));
          }
        }
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
        }));

        api.tasks.update(taskId, updates).catch(() => {});
      },

      deleteTask: (taskId, boardId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== taskId) }));
        if (task) get().addActivity(`deleted task "${task.title}"`, boardId);

        api.tasks.delete(taskId).catch(() => {});
      },

      moveTask: (taskId, toListId, boardId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        const fromList = get().lists.find((l) => l.id === task?.listId);
        const toList = get().lists.find((l) => l.id === toListId);
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, listId: toListId } : t)),
        }));
        if (task && fromList && toList) {
          set((s) => ({
            taskHistory: [{
              id: generateId(),
              taskId,
              changeType: 'listId',
              previousValue: fromList.title,
              newValue: toList.title,
              changedByName: get().currentUser.name,
              timestamp: new Date().toISOString(),
            }, ...s.taskHistory],
          }));
          get().addActivity(`moved "${task.title}" from ${fromList.title} → ${toList.title}`, boardId);
        }

        api.tasks.update(taskId, { listId: toListId }).catch(() => {});
      },

      completeTask: (taskId, boardId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;
        const nowCompleted = !task.completed;
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, completed: nowCompleted, completedAt: nowCompleted ? new Date().toISOString() : undefined }
              : t
          ),
          taskHistory: [{
            id: generateId(),
            taskId,
            changeType: 'completed',
            previousValue: String(!nowCompleted),
            newValue: String(nowCompleted),
            changedByName: get().currentUser.name,
            timestamp: new Date().toISOString(),
          }, ...s.taskHistory],
        }));
        get().addActivity(`${nowCompleted ? 'completed' : 'reopened'} "${task.title}"`, boardId);

        api.tasks.update(taskId, { completed: nowCompleted, completedAt: nowCompleted ? new Date() : null }).catch(() => {});
      },

      assignTask: (taskId, userId, boardId) => {
        const user = get().getUserById(userId);
        const task = get().tasks.find((t) => t.id === taskId);
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, assignedTo: [...new Set([...t.assignedTo, userId])] } : t
          ),
        }));
        if (user && task) get().addActivity(`assigned ${user.name} to "${task.title}"`, boardId);

        api.tasks.assign(taskId, userId).catch(() => {});
      },

      unassignTask: (taskId, userId) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, assignedTo: t.assignedTo.filter((u) => u !== userId) } : t
          ),
        }));

        const task = get().tasks.find((t) => t.id === taskId);
        if (task) {
          api.tasks.update(taskId, { assignedTo: task.assignedTo.filter((u) => u !== userId) }).catch(() => {});
        }
      },

      addActivity: (action, boardId) => {
        const activity: Activity = {
          id: generateId(),
          userId: get().currentUser.id,
          userName: get().currentUser.name,
          action,
          boardId,
          timestamp: new Date().toISOString(),
        };
        set((s) => ({ activities: [activity, ...s.activities] }));
      },

      visitBoard: (boardId) => {
        set((s) => {
          const recent = [boardId, ...s.recentBoardIds.filter((id) => id !== boardId)].slice(0, 5);
          return { recentBoardIds: recent };
        });
      },

      getListsByBoard: (boardId) => get().lists.filter((l) => l.boardId === boardId).sort((a, b) => a.position - b.position),

      getTasksByList: (listId) => {
        const q = get().searchQuery.toLowerCase();
        return get()
          .tasks.filter((t) => t.listId === listId && (!q || t.title.toLowerCase().includes(q)))
          .sort((a, b) => a.position - b.position);
      },

      getFilteredTasksByList: (listId, filters) => {
        const q = get().searchQuery.toLowerCase();
        return get()
          .tasks.filter((t) => {
            if (t.listId !== listId) return false;
            if (q && !t.title.toLowerCase().includes(q)) return false;
            if (filters.priority && t.priority !== filters.priority) return false;
            if (filters.assignee && !t.assignedTo.includes(filters.assignee)) return false;
            if (filters.completed === 'active' && t.completed) return false;
            if (filters.completed === 'completed' && !t.completed) return false;
            return true;
          })
          .sort((a, b) => a.position - b.position);
      },

      getActivitiesByBoard: (boardId) => get().activities.filter((a) => a.boardId === boardId),

      getCompletedTasksByDate: (date) => {
        const target = new Date(date);
        return get().tasks.filter((t) => {
          if (!t.completed || !t.completedAt) return false;
          const d = new Date(t.completedAt);
          return d.toDateString() === target.toDateString();
        });
      },

      getTaskHistory: (taskId) => get().taskHistory.filter((h) => h.taskId === taskId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      getUserById: (userId) => get().users.find((u) => u.id === userId),
      getBoardById: (boardId) => get().boards.find((b) => b.id === boardId),
    }),
    { name: 'taskflow-storage' }
  )
);
