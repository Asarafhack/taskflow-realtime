import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface InviteMemberModalProps {
  boardId: string;
  boardTitle: string;
  onClose: () => void;
  onInvited: () => void;
}

const InviteMemberModal = ({ boardId, boardTitle, onClose, onInvited }: InviteMemberModalProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await api.boards.addMember(boardId, email.trim());
      setSuccess(true);
      toast.success(`${email} added to ${boardTitle}`);
      setTimeout(() => {
        onInvited();
        onClose();
      }, 800);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
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
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Invite Member</h3>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Add a team member to <span className="text-foreground font-medium">{boardTitle}</span>
          </p>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-6 gap-3"
            >
              <CheckCircle2 className="w-10 h-10 text-accent" />
              <p className="text-sm text-foreground font-medium">Member added</p>
            </motion.div>
          ) : (
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@company.com"
                  className="bg-secondary/50 border-border/50 text-foreground pl-10"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? 'Adding...' : 'Add to Board'}
              </Button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InviteMemberModal;
