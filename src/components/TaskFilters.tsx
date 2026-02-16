import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Priority } from '@/types';
import { useBoardStore } from '@/store/boardStore';

interface TaskFiltersProps {
  priorityFilter: Priority | null;
  assigneeFilter: string | null;
  completedFilter: 'all' | 'active' | 'completed';
  onPriorityChange: (p: Priority | null) => void;
  onAssigneeChange: (id: string | null) => void;
  onCompletedChange: (v: 'all' | 'active' | 'completed') => void;
}

const TaskFilters = ({
  priorityFilter, assigneeFilter, completedFilter,
  onPriorityChange, onAssigneeChange, onCompletedChange,
}: TaskFiltersProps) => {
  const { users } = useBoardStore();
  const hasFilters = priorityFilter || assigneeFilter || completedFilter !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="flex items-center gap-3 flex-wrap"
    >
      <Filter className="w-3.5 h-3.5 text-muted-foreground" />

      <div className="flex gap-1">
        {(['high', 'medium', 'low'] as Priority[]).map((p) => (
          <button
            key={p}
            onClick={() => onPriorityChange(priorityFilter === p ? null : p)}
            className={`px-2 py-1 text-[10px] font-medium rounded-md transition-all capitalize ${
              priorityFilter === p
                ? 'bg-primary/20 text-primary ring-1 ring-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="w-px h-4 bg-border/50" />

      <select
        value={assigneeFilter || ''}
        onChange={(e) => onAssigneeChange(e.target.value || null)}
        className="bg-secondary/50 border border-border/30 rounded-md text-[10px] text-foreground px-2 py-1 outline-none"
      >
        <option value="">All members</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      <div className="w-px h-4 bg-border/50" />

      <div className="flex gap-1">
        {(['all', 'active', 'completed'] as const).map((v) => (
          <button
            key={v}
            onClick={() => onCompletedChange(v)}
            className={`px-2 py-1 text-[10px] font-medium rounded-md transition-all capitalize ${
              completedFilter === v
                ? 'bg-accent/20 text-accent ring-1 ring-accent/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {hasFilters && (
        <button
          onClick={() => { onPriorityChange(null); onAssigneeChange(null); onCompletedChange('all'); }}
          className="text-muted-foreground hover:text-foreground transition-colors ml-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  );
};

export default TaskFilters;
