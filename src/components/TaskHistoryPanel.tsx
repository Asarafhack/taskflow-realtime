import { motion } from 'framer-motion';
import { History, ArrowRight, Flag, User, Tag, CheckCircle2, List } from 'lucide-react';
import { TaskHistoryEntry } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface TaskHistoryPanelProps {
  history: TaskHistoryEntry[];
}

const CHANGE_ICONS: Record<string, typeof Flag> = {
  priority: Flag,
  assignedTo: User,
  colorTag: Tag,
  completed: CheckCircle2,
  listId: List,
  title: History,
  description: History,
};

const CHANGE_LABELS: Record<string, string> = {
  priority: 'Priority changed',
  assignedTo: 'Assignment updated',
  colorTag: 'Color tag changed',
  completed: 'Completion status',
  listId: 'Moved to list',
  title: 'Title updated',
  description: 'Description updated',
};

const TaskHistoryPanel = ({ history }: TaskHistoryPanelProps) => {
  if (history.length === 0) {
    return (
      <div className="py-3 text-center">
        <p className="text-xs text-muted-foreground">No changes recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[200px] overflow-y-auto">
      {history.slice(0, 15).map((entry, i) => {
        const Icon = CHANGE_ICONS[entry.changeType] || History;
        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex gap-2 items-start py-1.5 border-b border-border/20 last:border-0"
          >
            <div className="w-5 h-5 rounded bg-secondary/50 flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="w-2.5 h-2.5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-foreground font-medium">{CHANGE_LABELS[entry.changeType] || entry.changeType}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">{entry.previousValue}</span>
                <ArrowRight className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                <span className="text-[10px] text-primary truncate max-w-[80px]">{entry.newValue}</span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                {entry.changedByName} · {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TaskHistoryPanel;
