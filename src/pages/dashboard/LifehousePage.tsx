import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLifehouse } from '@/hooks/useLifehouse';
import { supabase } from '@/lib/supabase';
import AttendanceRegister from '@/components/dashboard/AttendanceRegister';
import PendingRequestsPanel from '@/components/dashboard/PendingRequestsPanel';
import NeedsOutreachPanel from '@/components/dashboard/NeedsOutreachPanel';
import type { Lifehouse } from '@/types';

// View for Lead role — their assigned lifehouse
const LeadView = () => {
  const { lifehouse, loading } = useLifehouse();

  if (loading) return <Spinner />;

  if (!lifehouse) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <p className="font-cabinet font-bold text-2xl text-pink-swirl mb-2">No Lifehouse Assigned</p>
        <p className="font-general text-sm text-pink-swirl/50">
          You are not currently assigned as a Lifehouse lead. Contact an Admin.
        </p>
      </div>
    );
  }

  return <LifehouseDetail lifehouse={lifehouse} />;
};

// View for Admin role — picker for any lifehouse
const AdminView = () => {
  const [lifehouses, setLifehouses] = useState<Lifehouse[]>([]);
  const [selected, setSelected] = useState<Lifehouse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('lifehouses')
      .select('*')
      .order('name')
      .then(({ data }) => {
        const list = (data as Lifehouse[]) ?? [];
        setLifehouses(list);
        if (list.length > 0) setSelected(list[0]);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;

  if (lifehouses.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <p className="font-cabinet font-bold text-2xl text-pink-swirl mb-2">No Lifehouses Yet</p>
        <p className="font-general text-sm text-pink-swirl/50">
          Create a Lifehouse from the Admin panel first.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Lifehouse selector */}
      {lifehouses.length > 1 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/40">
            Viewing
          </span>
          <select
            value={selected?.id ?? ''}
            onChange={e => setSelected(lifehouses.find(l => l.id === e.target.value) ?? null)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-pink-swirl font-general text-sm outline-none focus:border-waxy-corn/50 transition-colors bg-[#1c3828]"
          >
            {lifehouses.map(l => (
              <option key={l.id} value={l.id} className="bg-bitter-liquorice">{l.name}</option>
            ))}
          </select>
        </div>
      )}

      {selected && <LifehouseDetail lifehouse={selected} />}
    </div>
  );
};

// Shared detail view used by both roles
const LifehouseDetail = ({ lifehouse }: { lifehouse: Lifehouse }) => (
  <div className="max-w-5xl space-y-6">
    <div className="flex items-center gap-3 flex-wrap">
      <div>
        <h2 className="font-cabinet font-bold text-xl text-pink-swirl">{lifehouse.name}</h2>
        {(lifehouse.location || lifehouse.meeting_time) && (
          <p className="font-general text-sm text-pink-swirl/40 mt-0.5">
            {[lifehouse.location, lifehouse.meeting_time].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PendingRequestsPanel lifehouse={lifehouse} />
      <NeedsOutreachPanel lifehouse={lifehouse} />
    </div>
    <AttendanceRegister lifehouse={lifehouse} />
  </div>
);

const Spinner = () => (
  <div className="flex items-center justify-center h-48">
    <div className="w-8 h-8 rounded-full border-4 border-waxy-corn border-t-transparent animate-spin" />
  </div>
);

const LifehousePage = () => {
  const { profile } = useAuth();
  if (!profile) return <Spinner />;
  return profile.role === 'Admin' ? <AdminView /> : <LeadView />;
};

export default LifehousePage;
