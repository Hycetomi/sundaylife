import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui';
import type { Department, Profile, Role } from '@/types';

type Row = Profile & { departments: { name: string } | null };

const ROLES: Role[] = ['Volunteer', 'Lead', 'Admin'];

const StaffTable = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [staff, setStaff] = useState<Row[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*, departments(name)').order('full_name'),
      supabase.from('departments').select('*').order('name'),
    ]).then(([{ data: profiles }, { data: depts }]) => {
      setStaff((profiles as Row[]) ?? []);
      setDepartments((depts as Department[]) ?? []);
      setLoading(false);
    });
  }, []);

  const updateRole = async (profileId: string, role: Role) => {
    if (profileId === user?.id && role !== 'Admin') return;
    const prev = staff.find(p => p.id === profileId)?.role;
    setStaff(s => s.map(p => p.id === profileId ? { ...p, role } : p));
    const { error } = await supabase.from('profiles').update({ role }).eq('id', profileId);
    if (error) {
      setStaff(s => s.map(p => p.id === profileId ? { ...p, role: prev! } : p));
      toast.error('Failed to update role', 'Check your permissions.');
    } else {
      toast.success('Role updated');
    }
  };

  const updateDepartment = async (profileId: string, departmentId: string) => {
    const val = departmentId === '' ? null : departmentId;
    const prevRow = staff.find(p => p.id === profileId);
    const dept = departments.find(d => d.id === departmentId) ?? null;
    setStaff(s => s.map(p =>
      p.id === profileId ? { ...p, department_id: val, departments: dept ? { name: dept.name } : null } : p
    ));
    const { error } = await supabase.from('profiles').update({ department_id: val }).eq('id', profileId);
    if (error) {
      setStaff(s => s.map(p => p.id === profileId ? { ...prevRow!, ...p } : p));
      toast.error('Failed to update department', 'Check your permissions.');
    } else {
      toast.success('Department updated');
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/40 pb-3 pr-6">Name</th>
            <th className="text-left font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/40 pb-3 pr-6">Role</th>
            <th className="text-left font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/40 pb-3">Department</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {staff.map(person => {
            const isMe = person.id === user?.id;
            return (
              <tr key={person.id}>
                <td className="py-3 pr-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-waxy-corn/20 flex items-center justify-center flex-shrink-0">
                      <span className="font-cabinet font-bold text-xs text-waxy-corn">
                        {person.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                      </span>
                    </div>
                    <span className="font-general text-pink-swirl/90">
                      {person.full_name}
                      {isMe && <span className="ml-2 text-xs text-pink-swirl/30">(you)</span>}
                    </span>
                  </div>
                </td>

                <td className="py-3 pr-6">
                  <select
                    value={person.role}
                    onChange={e => updateRole(person.id, e.target.value as Role)}
                    disabled={isMe}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-pink-swirl font-general text-xs outline-none focus:border-waxy-corn/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r} className="bg-bitter-liquorice">{r}</option>
                    ))}
                  </select>
                </td>

                <td className="py-3">
                  <select
                    value={person.department_id ?? ''}
                    onChange={e => updateDepartment(person.id, e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-pink-swirl font-general text-xs outline-none focus:border-waxy-corn/50 transition-colors"
                  >
                    <option value="" className="bg-bitter-liquorice">Unassigned</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id} className="bg-bitter-liquorice">{d.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
