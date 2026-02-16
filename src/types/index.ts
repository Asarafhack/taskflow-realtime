export type Priority = 'low' | 'medium' | 'high';
export type ColorTag = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  listId: string;
  assignedTo: string[];
  priority: Priority;
  colorTag?: ColorTag;
  position: number;
  createdAt: string;
  locked?: boolean;
  lockedBy?: string;
  completed?: boolean;
  completedAt?: string;
}

export interface TaskList {
  id: string;
  title: string;
  boardId: string;
  position: number;
}

export interface Board {
  id: string;
  title: string;
  members: string[];
  createdAt: string;
  color?: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  taskTitle?: string;
  boardId: string;
  timestamp: string;
}

export interface TaskHistoryEntry {
  id: string;
  taskId: string;
  changeType: string;
  previousValue: string;
  newValue: string;
  changedByName: string;
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
