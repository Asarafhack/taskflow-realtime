import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal } from 'lucide-react';
import { TaskList as TaskListType, Task } from '@/types';
import TaskCard from './TaskCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TaskListProps {
  list: TaskListType;
  tasks: Task[];
  onAddTask: (title: string) => void;
  onTaskClick: (task: Task) => void;
}

const TaskListColumn = ({ list, tasks, onAddTask, onTaskClick }: TaskListProps) => {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: { type: 'list', listId: list.id },
  });

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddTask(newTitle.trim());
    setNewTitle('');
    setAdding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`board-column ${isOver ? 'ring-2 ring-primary/30' : ''}`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{list.title}</h3>
          <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto space-y-2 min-h-[60px] pb-2">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
      </div>

      {adding ? (
        <div className="mt-2 space-y-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title..."
            className="bg-muted/50 border-border/50 text-foreground text-sm"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs">Add</Button>
            <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setNewTitle(''); }} className="text-muted-foreground text-xs">Cancel</Button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="mt-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-full p-2 rounded-lg hover:bg-muted/30">
          <Plus className="w-4 h-4" /> Add task
        </button>
      )}
    </motion.div>
  );
};

export default TaskListColumn;
