import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Copy, HeartHandshake } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Lifehouse, RetentionAlert } from '@/types';

interface Props {
  lifehouse: Lifehouse;
}

const NeedsOutreachPanel = ({ lifehouse }: Props) => {
  const [alerts, setAlerts] = useState<RetentionAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('retention_alerts')
      .select('*')
      .eq('lifehouse_id', lifehouse.id)
      .then(({ data }) => {
        setAlerts((data as RetentionAlert[]) ?? []);
        setLoading(false);
      });
  }, [lifehouse.id]);

  const copyPhone = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <HeartHandshake size={18} className="text-hot-red/70" />
        <h2 className="font-cabinet font-bold text-lg text-pink-swirl">Needs Outreach</h2>
      </div>
      <p className="font-general text-xs text-pink-swirl/40 mb-5">
        Members with fewer than 3 check-ins in the last 30 days.
      </p>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      )}

      {!loading && alerts.length === 0 && (
        <div className="flex flex-col items-center py-10 text-pink-swirl/30">
          <HeartHandshake size={32} strokeWidth={1} className="mb-2" />
          <p className="font-general text-sm">Everyone's engaged — great work!</p>
        </div>
      )}

      {!loading && alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-hot-red/5 border border-hot-red/10"
            >
              <div className="flex-1 min-w-0">
                <p className="font-general text-sm text-pink-swirl">{alert.full_name}</p>
                <p className="font-general text-xs text-pink-swirl/40 mt-0.5">
                  {alert.attendance_count} / 4 meetings attended
                </p>
              </div>
              {alert.phone && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`tel:${alert.phone}`}
                    className="text-pink-swirl/40 hover:text-waxy-corn transition-colors"
                    title="Call"
                  >
                    <Phone size={15} />
                  </a>
                  <button
                    onClick={() => copyPhone(alert.phone!, alert.id)}
                    className="text-pink-swirl/40 hover:text-waxy-corn transition-colors"
                    title="Copy number"
                  >
                    {copied === alert.id
                      ? <span className="font-general text-[10px] text-fluorescence">Copied!</span>
                      : <Copy size={14} />
                    }
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NeedsOutreachPanel;
