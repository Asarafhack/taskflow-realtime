import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Clock, Zap, LayoutGrid, LogOut, Users, CheckCircle2 } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import bgPattern from '@/assets/bg-pattern.jpg';

const BOARD_COLORS: Record<string, string> = {
  blue: 'from-blue-500/20 to-blue-600/5',
  green: 'from-emerald-500/20 to-emerald-600/5',
  purple: 'from-violet-500/20 to-violet-600/5',
  red: 'from-red-500/20 to-red-600/5',
  orange: 'from-orange-500/20 to-orange-600/5',
};

const BOARD_BORDER_COLORS: Record<string, string> = {
  blue: 'border-blue-500/20 hover:border-blue-500/40',
  green: 'border-emerald-500/20 hover:border-emerald-500/40',
  purple: 'border-violet-500/20 hover:border-violet-500/40',
  red: 'border-red-500/20 hover:border-red-500/40',
  orange: 'border-orange-500/20 hover:border-orange-500/40',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { boards, recentBoardIds, addBoard, getBoardById, currentUser, users, tasks } = useBoardStore();
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const recentBoards = recentBoardIds.map((id) => getBoardById(id)).filter(Boolean);
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;

  const handleCreate = () => {
    if (!newBoardTitle.trim()) return;
    addBoard(newBoardTitle.trim());
    setNewBoardTitle('');
    setDialogOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background relative">
      <img src={bgPattern} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" />
      <div className="relative z-10">
        <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground">TaskFlow</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-sm text-foreground hidden sm:block">{currentUser.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{boards.length}</p>
                <p className="text-xs text-muted-foreground">Active Boards</p>
              </div>
            </div>
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedCount}<span className="text-sm text-muted-foreground font-normal">/{totalTasks}</span></p>
                <p className="text-xs text-muted-foreground">Tasks Completed</p>
              </div>
            </div>
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
                <p className="text-xs text-muted-foreground">Team Members</p>
              </div>
            </div>
          </motion.div>

          {recentBoards.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recently Viewed</h2>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recentBoards.map((board) => board && (
                  <motion.button
                    key={board.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/board/${board.id}`)}
                    className={`glass-card-hover min-w-[200px] p-4 text-left bg-gradient-to-br ${BOARD_COLORS[board.color || 'blue']}`}
                  >
                    <span className="text-sm font-semibold text-foreground">{board.title}</span>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}

          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">All Boards</h2>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-1" /> New Board
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Create Board</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="space-y-4 mt-2">
                    <Input
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      placeholder="Board title..."
                      className="bg-secondary/50 border-border/50 text-foreground"
                      autoFocus
                    />
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Create</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {boards.map((board, i) => (
                <motion.button
                  key={board.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/board/${board.id}`)}
                  className={`glass-card-hover p-5 text-left bg-gradient-to-br ${BOARD_COLORS[board.color || 'blue']} ${BOARD_BORDER_COLORS[board.color || 'blue']}`}
                >
                  <h3 className="font-semibold text-foreground mb-3">{board.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {board.members.slice(0, 3).map((memberId) => {
                        const user = users.find((u) => u.id === memberId);
                        return (
                          <div key={memberId} className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                            {user?.name.charAt(0)}
                          </div>
                        );
                      })}
                      {board.members.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                          +{board.members.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(board.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
