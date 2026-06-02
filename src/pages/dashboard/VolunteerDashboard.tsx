import MyTasksPanel from '@/components/dashboard/MyTasksPanel';
import LeaderboardWidget from '@/components/dashboard/LeaderboardWidget';

const VolunteerDashboard = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
    <div className="lg:col-span-2">
      <MyTasksPanel />
    </div>
    <div>
      <LeaderboardWidget />
    </div>
  </div>
);

export default VolunteerDashboard;
