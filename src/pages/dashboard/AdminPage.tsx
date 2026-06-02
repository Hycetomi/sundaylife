import { useState } from 'react';
import { Users, Church } from 'lucide-react';
import { cn } from '@/lib/utils';
import StaffTable from '@/components/dashboard/admin/StaffTable';
import LifehouseManager from '@/components/dashboard/admin/LifehouseManager';

type Tab = 'staff' | 'lifehouses';

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'staff',      label: 'Staff',      Icon: Users  },
  { id: 'lifehouses', label: 'Lifehouses', Icon: Church },
];

const AdminPage = () => {
  const [tab, setTab] = useState<Tab>('staff');

  return (
    <div className="max-w-5xl space-y-6">

      {/* Tab bar */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-general text-sm transition-all',
              tab === id
                ? 'bg-waxy-corn text-bitter-liquorice font-medium'
                : 'text-pink-swirl/60 hover:text-pink-swirl'
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        {tab === 'staff'      && <StaffTable />}
        {tab === 'lifehouses' && <LifehouseManager />}
      </div>

    </div>
  );
};

export default AdminPage;
