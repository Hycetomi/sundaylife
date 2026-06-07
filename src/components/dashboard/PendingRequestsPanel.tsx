import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Inbox } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button, useToast } from '@/components/ui';
import type { Lifehouse, LifehouseRequest } from '@/types';

interface Props {
  lifehouse: Lifehouse;
}

const PendingRequestsPanel = ({ lifehouse }: Props) => {
  const toast = useToast();
  const [requests, setRequests] = useState<LifehouseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('lifehouse_requests')
      .select('*')
      .eq('status', 'Pending')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setRequests((data as LifehouseRequest[]) ?? []);
        setLoading(false);
      });
  }, []);

  const approve = async (req: LifehouseRequest) => {
    setApproving(req.id);

    await supabase
      .from('lifehouse_requests')
      .update({ status: 'Approved' })
      .eq('id', req.id);

    const { error } = await supabase.from('members').insert([{
      full_name:    req.full_name,
      phone:        req.phone,
      email:        req.email,
      address:      req.address_area,
      lifehouse_id: lifehouse.id,
    }]);

    setApproving(null);

    if (error) {
      toast.error('Failed to approve request', 'The request was marked approved but member creation failed.');
    } else {
      toast.success(`${req.full_name} added to ${lifehouse.name}`);
      setRequests(prev => prev.filter(r => r.id !== req.id));
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-cabinet font-bold text-lg text-pink-swirl">Pending Sign-ups</h2>
        <span className="font-cabinet font-bold text-xs text-pink-swirl/40 bg-white/10 px-2.5 py-1 rounded-full">
          {requests.length}
        </span>
      </div>

      {loading && (
        <div className="space-y-2">
          {[1, 2].map(i => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="flex flex-col items-center py-10 text-pink-swirl/30">
          <Inbox size={32} strokeWidth={1} className="mb-2" />
          <p className="font-general text-sm">No pending requests.</p>
        </div>
      )}

      {!loading && (
        <AnimatePresence initial={false}>
          <div className="space-y-3">
            {requests.map((req) => (
              <motion.div
                key={req.id}
                layout
                exit={{ opacity: 0, x: 20 }}
                className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/5"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-general text-sm text-pink-swirl font-medium">{req.full_name}</p>
                  <p className="font-general text-xs text-pink-swirl/40 mt-0.5">{req.email}</p>
                  <p className="font-general text-xs text-pink-swirl/40">{req.address_area} · {req.phone}</p>
                </div>
                <Button
                  size="sm"
                  icon={<UserCheck size={13} />}
                  loading={approving === req.id}
                  onClick={() => approve(req)}
                  className="flex-shrink-0 bg-fluorescence/15 text-fluorescence hover:bg-fluorescence/25 hover:shadow-none"
                >
                  Approve
                </Button>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default PendingRequestsPanel;
