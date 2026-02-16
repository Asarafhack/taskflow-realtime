import { motion } from 'framer-motion';
import { Activity as ActivityIcon, Filter } from 'lucide-react';
import { Activity } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { useBoardStore } from '@/store/boardStore';

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const { users } = useBoardStore();
  const [filterUser, setFilterUser] = useState<string | null>(null);

  const filtered = filterUser ? activities.filter((a) => a.userId === filterUser) : activities;

  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ActivityIcon className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Activity</h3>
        </div>
        <div className="relative group">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Filter className="w-3.5 h-3.5" />
          </button>
          <div className="absolute right-0 top-6 bg-card border border-border rounded-lg p-2 hidden group-hover:block min-w-[120px] z-10 shadow-lg">
            <button onClick={() => setFilterUser(null)} className={`w-full text-left text-xs px-2 py-1 rounded ${!filterUser ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>All</button>
            {users.map((u) => (
              <button key={u.id} onClick={() => setFilterUser(u.id)} className={`w-full text-left text-xs px-2 py-1 rounded ${filterUser === u.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                {u.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {filtered.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No activity yet</p>}
        {filtered.slice(0, 20).map((activity, i) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex gap-3 items-start"
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-semibold text-primary mt-0.5 shrink-0">
              {activity.userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground">
                <span className="font-medium">{activity.userName}</span>{' '}
                <span className="text-muted-foreground">{activity.action}</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
