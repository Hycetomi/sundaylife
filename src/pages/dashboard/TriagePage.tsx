import { useState } from 'react';
import TriageQueue from '@/components/dashboard/TriageQueue';
import TaskCreatorForm from '@/components/dashboard/TaskCreatorForm';

const TriagePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-general text-sm text-pink-swirl/50 mt-1">
            Assign incoming requests to your team or submit a new task.
          </p>
        </div>
        <TaskCreatorForm onCreated={() => setRefreshKey(k => k + 1)} />
      </div>
      <TriageQueue key={refreshKey} />
    </div>
  );
};

export default TriagePage;
