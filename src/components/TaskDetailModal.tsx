import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, User, Tag, Flag, MessageSquare, History, CheckCircle2 } from 'lucide-react';
import { Task, Priority, ColorTag } from '@/types';
import { useBoardStore } from '@/store/boardStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import TaskHistoryPanel from './TaskHistoryPanel';

interface TaskDetailModalProps {
  task: Task;
  boardId: string;
  onClose: () => void;
}

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: 'High', color: 'bg-red-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'low', label: 'Low', color: 'bg-emerald-500' },
];

const COLORS: { value: ColorTag; color: string }[] = [
  { value: 'blue', color: 'bg-blue-500' },
  { value: 'green', color: 'bg-emerald-500' },
  { value: 'yellow', color: 'bg-yellow-500' },
  { value: 'red', color: 'bg-red-500' },
  { value: 'purple', color: 'bg-violet-500' },
  { value: 'orange', color: 'bg-orange-500' },
];

const TaskDetailModal = ({ task, boardId, onClose }: TaskDetailModalProps) => {
  const { updateTask, deleteTask, assignTask, unassignTask, completeTask, users, getTaskHistory } = useBoardStore();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [showHistory, setShowHistory] = useState(false);

  const history = getTaskHistory(task.id);

  const handleSave = () => {
    updateTask(task.id, { title, description });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-lg max-h-[85vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSave}
                  className="text-lg font-semibold bg-transparent border-none text-foreground p-0 h-auto focus-visible:ring-0"
                />
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => completeTask(task.id, boardId)}
                  className={`p-1.5 rounded-lg transition-all ${task.completed ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                  title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {task.completed && task.completedAt && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span className="text-xs text-accent font-medium">Completed {new Date(task.completedAt).toLocaleDateString()}</span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <MessageSquare className="w-3.5 h-3.5" /> Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleSave}
                  placeholder="Add a description..."
                  className="bg-secondary/30 border-border/30 text-foreground text-sm min-h-[80px] resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <Flag className="w-3.5 h-3.5" /> Priority
                </label>
                <div className="flex gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => updateTask(task.id, { priority: p.value })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        task.priority === p.value ? 'bg-secondary text-foreground ring-1 ring-primary/30' : 'text-muted-foreground hover:bg-secondary/50'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${p.color}`} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <Tag className="w-3.5 h-3.5" /> Color Tag
                </label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => updateTask(task.id, { colorTag: task.colorTag === c.value ? undefined : c.value })}
                      className={`w-6 h-6 rounded-full ${c.color} transition-all ${task.colorTag === c.value ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card' : 'opacity-50 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <User className="w-3.5 h-3.5" /> Assigned
                </label>
                <div className="flex flex-wrap gap-2">
                  {users.map((user) => {
                    const assigned = task.assignedTo.includes(user.id);
                    return (
                      <button
                        key={user.id}
                        onClick={() => assigned ? unassignTask(task.id, user.id) : assignTask(task.id, user.id, boardId)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          assigned ? 'bg-primary/20 text-primary ring-1 ring-primary/30' : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold">{user.name.charAt(0)}</div>
                        {user.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-border/30 pt-4">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 hover:text-foreground transition-colors"
                >
                  <History className="w-3.5 h-3.5" /> Change History
                  <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full font-normal normal-case">{history.length}</span>
                </button>
                {showHistory && <TaskHistoryPanel history={history} />}
              </div>

              <div className="pt-4 border-t border-border/30 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Created {new Date(task.createdAt).toLocaleDateString()}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { deleteTask(task.id, boardId); onClose(); }}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskDetailModal;
