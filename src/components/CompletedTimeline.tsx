import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, ChevronDown } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';
import { useState } from 'react';
import { format, subDays } from 'date-fns';

const CompletedTimeline = () => {
  const { getCompletedTasksByDate } = useBoardStore();
  const [expandedDate, setExpandedDate] = useState<string | null>(format(new Date(), 'yyyy-MM-dd'));

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), i);
    return format(d, 'yyyy-MM-dd');
  });

  const dateLabels: Record<string, string> = {};
  dates.forEach((d, i) => {
    if (i === 0) dateLabels[d] = 'Today';
    else if (i === 1) dateLabels[d] = 'Yesterday';
    else dateLabels[d] = format(new Date(d), 'MMM d');
  });

  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold text-foreground">Completed</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {dates.map((date) => {
          const tasks = getCompletedTasksByDate(date);
          const isExpanded = expandedDate === date;

          return (
            <div key={date}>
              <button
                onClick={() => setExpandedDate(isExpanded ? null : date)}
                className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">{dateLabels[date]}</span>
                  {tasks.length > 0 && (
                    <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full font-semibold">{tasks.length}</span>
                  )}
                </div>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="pl-7 space-y-1 pb-2"
                >
                  {tasks.length === 0 ? (
                    <p className="text-[10px] text-muted-foreground py-1">No tasks completed</p>
                  ) : (
                    tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 py-1"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                        <span className="text-xs text-foreground truncate">{task.title}</span>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompletedTimeline;
