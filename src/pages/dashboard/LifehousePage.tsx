import { useAuth } from '@/hooks/useAuth';
import { useLifehouse } from '@/hooks/useLifehouse';
import AttendanceRegister from '@/components/dashboard/AttendanceRegister';
import PendingRequestsPanel from '@/components/dashboard/PendingRequestsPanel';
import NeedsOutreachPanel from '@/components/dashboard/NeedsOutreachPanel';

const LifehousePage = () => {
  const { profile } = useAuth();
  const { lifehouse, loading } = useLifehouse();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 rounded-full border-4 border-waxy-corn border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!lifehouse) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <p className="font-cabinet font-bold text-2xl text-pink-swirl mb-2">No Lifehouse Assigned</p>
        <p className="font-general text-sm text-pink-swirl/50">
          {profile?.role === 'Admin'
            ? 'Assign a lead to a Lifehouse in the database to see data here.'
            : 'You are not currently assigned as a Lifehouse lead. Contact an Admin.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingRequestsPanel lifehouse={lifehouse} />
        <NeedsOutreachPanel lifehouse={lifehouse} />
      </div>
      <AttendanceRegister lifehouse={lifehouse} />
    </div>
  );
};

export default LifehousePage;
