import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types';

const RANK_MEDAL = ['🥇', '🥈', '🥉'];

const LeaderboardWidget = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('monthly_leaderboard')
      .select('id, full_name, completed_count')
      .limit(5)
      .then(({ data }) => {
        setEntries((data as LeaderboardEntry[]) ?? []);
        setLoading(false);
      });
  }, []);

  const maxCount = entries[0]?.completed_count || 1;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Trophy size={18} className="text-waxy-corn" />
        <h2 className="font-cabinet font-bold text-lg text-pink-swirl">This Month</h2>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-10 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <p className="font-general text-sm text-pink-swirl/30 text-center py-6">
          No completions yet this month.
        </p>
      )}

      {!loading && entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry, i) => {
            const isMe = entry.id === user?.id;
            const pct = Math.max(8, Math.round((entry.completed_count / maxCount) * 100));
            return (
              <div
                key={entry.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl transition-colors',
                  isMe ? 'bg-waxy-corn/10 ring-1 ring-waxy-corn/30' : 'hover:bg-white/5'
                )}
              >
                <span className="text-base w-6 text-center flex-shrink-0">
                  {i < 3 ? RANK_MEDAL[i] : <span className="font-cabinet text-sm text-pink-swirl/30">{i + 1}</span>}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn('font-general text-sm truncate', isMe ? 'text-waxy-corn font-medium' : 'text-pink-swirl/80')}>
                      {isMe ? 'You' : entry.full_name}
                    </span>
                    <span className={cn('font-cabinet font-bold text-sm ml-2 flex-shrink-0', isMe ? 'text-waxy-corn' : 'text-pink-swirl/50')}>
                      {entry.completed_count}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700', isMe ? 'bg-waxy-corn' : 'bg-astral-blue/60')}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeaderboardWidget;
