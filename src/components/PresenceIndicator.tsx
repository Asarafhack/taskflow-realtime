import { motion } from 'framer-motion';
import { useBoardStore } from '@/store/boardStore';

interface PresenceIndicatorProps {
  boardId: string;
}

const PresenceIndicator = ({ boardId }: PresenceIndicatorProps) => {
  const { onlineUsers, getUserById } = useBoardStore();
  const online = onlineUsers[boardId] || [];

  if (online.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-1.5">
        {online.slice(0, 4).map((uid, i) => {
          const user = getUserById(uid);
          return (
            <motion.div
              key={uid}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="w-7 h-7 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-[10px] font-semibold text-primary relative"
              title={user?.name}
            >
              {user?.name.charAt(0)}
              <div className="absolute -bottom-0.5 -right-0.5 presence-dot bg-success" />
            </motion.div>
          );
        })}
      </div>
      <span className="text-xs text-muted-foreground">
        {online.length} online
      </span>
    </div>
  );
};

export default PresenceIndicator;
