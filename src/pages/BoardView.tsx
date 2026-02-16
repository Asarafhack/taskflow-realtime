import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCorners, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Search, Zap, LogOut, CheckCircle2, UserPlus, SlidersHorizontal } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';
import { useAuthStore } from '@/store/authStore';
import { Task, Priority } from '@/types';
import TaskListColumn from '@/components/TaskListColumn';
import TaskDetailModal from '@/components/TaskDetailModal';
import ActivityFeed from '@/components/ActivityFeed';
import CompletedTimeline from '@/components/CompletedTimeline';
import PresenceIndicator from '@/components/PresenceIndicator';
import TaskCard from '@/components/TaskCard';
import TaskFilters from '@/components/TaskFilters';
import InviteMemberModal from '@/components/InviteMemberModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { socketService } from '@/services/socket';
import bgPattern from '@/assets/bg-pattern.jpg';

const BoardView = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const {
    getBoardById, getListsByBoard, getFilteredTasksByList, getActivitiesByBoard,
    addList, addTask, moveTask, visitBoard, searchQuery, setSearchQuery, currentUser, fetchBoardData,
  } = useBoardStore();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [sidePanel, setSidePanel] = useState<'activity' | 'completed' | null>('activity');
  const [newListTitle, setNewListTitle] = useState('');
  const [addingList, setAddingList] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [completedFilter, setCompletedFilter] = useState<'all' | 'active' | 'completed'>('all');

  const board = getBoardById(boardId || '');
  const lists = getListsByBoard(boardId || '');
  const activities = getActivitiesByBoard(boardId || '');

  useEffect(() => {
    if (boardId) {
      visitBoard(boardId);
      fetchBoardData(boardId);
      socketService.connect();
      socketService.joinBoard(boardId);
      const unsub = socketService.on('refresh', () => fetchBoardData(boardId));
      return () => { unsub(); socketService.leaveBoard(boardId); };
    }
  }, [boardId, visitBoard, fetchBoardData]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task as Task | undefined;
    if (task) setActiveTask(task);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || !boardId) return;

    const taskId = active.id as string;
    let targetListId: string | undefined;

    if (over.data.current?.type === 'list') {
      targetListId = over.data.current.listId;
    } else if (over.data.current?.type === 'task') {
      targetListId = over.data.current.task.listId;
    }

    if (targetListId) {
      const currentTask = active.data.current?.task as Task | undefined;
      if (currentTask && currentTask.listId !== targetListId) {
        moveTask(taskId, targetListId, boardId);
        socketService.emitTaskChange(boardId);
      }
    }
  }, [boardId, moveTask]);

  const handleAddList = () => {
    if (!newListTitle.trim() || !boardId) return;
    addList(newListTitle.trim(), boardId);
    setNewListTitle('');
    setAddingList(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Board not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <img src={bgPattern} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none" />
      <div className="relative z-10 flex flex-col flex-1">
        <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <h1 className="font-semibold text-foreground">{board.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PresenceIndicator boardId={boardId!} />
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-48 h-8 pl-8 text-xs bg-secondary/50 border-border/30 text-foreground"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${showFilters ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <SlidersHorizontal className="w-3 h-3" /> Filters
              </button>
              <button
                onClick={() => setShowInvite(true)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <UserPlus className="w-3 h-3" /> Invite
              </button>
              <button
                onClick={() => setSidePanel(sidePanel === 'activity' ? null : 'activity')}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${sidePanel === 'activity' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Activity
              </button>
              <button
                onClick={() => setSidePanel(sidePanel === 'completed' ? null : 'completed')}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${sidePanel === 'completed' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <CheckCircle2 className="w-3 h-3" /> Done
              </button>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-foreground w-8 h-8">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {showFilters && (
            <div className="px-4 pb-3">
              <TaskFilters
                priorityFilter={priorityFilter}
                assigneeFilter={assigneeFilter}
                completedFilter={completedFilter}
                onPriorityChange={setPriorityFilter}
                onAssigneeChange={setAssigneeFilter}
                onCompletedChange={setCompletedFilter}
              />
            </div>
          )}
        </header>

        <div className="flex-1 flex overflow-hidden">
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex-1 overflow-x-auto p-4">
              <div className="flex gap-4 h-full">
                {lists.map((list) => (
                  <TaskListColumn
                    key={list.id}
                    list={list}
                    tasks={getFilteredTasksByList(list.id, { priority: priorityFilter, assignee: assigneeFilter, completed: completedFilter })}
                    onAddTask={(title) => {
                      addTask(title, list.id, boardId!);
                      socketService.emitTaskChange(boardId!);
                    }}
                    onTaskClick={(task) => setSelectedTask(task)}
                  />
                ))}
                {addingList ? (
                  <div className="min-w-[300px] max-w-[300px] space-y-2 p-3">
                    <Input
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      placeholder="List title..."
                      className="bg-secondary/50 border-border/50 text-foreground text-sm"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddList} className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs">Add</Button>
                      <Button size="sm" variant="ghost" onClick={() => setAddingList(false)} className="text-muted-foreground text-xs">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAddingList(true)}
                    className="min-w-[300px] max-w-[300px] h-12 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground bg-secondary/20 hover:bg-secondary/30 rounded-xl border border-dashed border-border/50 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add List
                  </motion.button>
                )}
              </div>
            </div>
            <DragOverlay>
              {activeTask && (
                <div className="rotate-3 opacity-90">
                  <TaskCard task={activeTask} onClick={() => {}} />
                </div>
              )}
            </DragOverlay>
          </DndContext>

          {sidePanel && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-l border-border/50 overflow-hidden shrink-0"
            >
              <div className="w-[300px] h-full p-3">
                {sidePanel === 'activity' ? (
                  <ActivityFeed activities={activities} />
                ) : (
                  <CompletedTimeline />
                )}
              </div>
            </motion.aside>
          )}
        </div>

        {selectedTask && (
          <TaskDetailModal task={selectedTask} boardId={boardId!} onClose={() => setSelectedTask(null)} />
        )}

        {showInvite && (
          <InviteMemberModal
            boardId={boardId!}
            boardTitle={board.title}
            onClose={() => setShowInvite(false)}
            onInvited={() => fetchBoardData(boardId!)}
          />
        )}
      </div>
    </div>
  );
};

export default BoardView;
