import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, Lock, CheckCircle2 } from 'lucide-react';
import { Task } from '@/types';
import { useBoardStore } from '@/store/boardStore';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const PRIORITY_CLASSES: Record<string, string> = {
  high: 'priority-high',
  medium: 'priority-medium',
  low: 'priority-low',
};

const COLOR_TAG_CLASSES: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  purple: 'bg-violet-500',
  orange: 'bg-orange-500',
};

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const { getUserById } = useBoardStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      onClick={onClick}
      className={`glass-card p-3 task-card-drag group ${PRIORITY_CLASSES[task.priority]} ${isDragging ? 'opacity-50 rotate-2 shadow-xl z-50' : ''} ${task.locked ? 'task-card-locked' : ''} ${task.completed ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-2">
        <button {...attributes} {...listeners} className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {task.colorTag && <div className={`w-2 h-2 rounded-full ${COLOR_TAG_CLASSES[task.colorTag]}`} />}
            {task.locked && <Lock className="w-3 h-3 text-yellow-500" />}
            {task.completed && <CheckCircle2 className="w-3 h-3 text-accent" />}
          </div>
          <p className={`text-sm font-medium text-foreground truncate ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
          {task.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
          {task.assignedTo.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {task.assignedTo.slice(0, 3).map((uid) => {
                const user = getUserById(uid);
                return (
                  <div key={uid} className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-semibold text-muted-foreground" title={user?.name}>
                    {user?.name.charAt(0)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
