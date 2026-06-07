import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Copy, Check, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Button, SelectField, Modal, useToast } from '@/components/ui';
import type { VolunteerApplication, VolunteerApplicationStatus, Department } from '@/types';

// ── Approve modal ─────────────────────────────────────────────────────────────

const ApproveModal = ({
  application,
  departments,
  onClose,
  onApproved,
}: {
  application: VolunteerApplication;
  departments: Department[];
  onClose: () => void;
  onApproved: () => void;
}) => {
  const toast = useToast();
  const [deptId, setDeptId] = useState(application.preferred_department_id ?? '');
  const [saving, setSaving] = useState(false);

  const handleApprove = async () => {
    if (!deptId) { toast.warning('Select a department before approving'); return; }
    setSaving(true);
    const { error } = await supabase
      .from('volunteer_applications')
      .update({ status: 'Approved', assigned_department_id: deptId })
      .eq('id', application.id);
    setSaving(false);
    if (error) { toast.error('Failed to approve application'); return; }
    toast.success(`${application.full_name} approved`);
    onApproved();
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Approve Volunteer"
      size="sm"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button loading={saving} onClick={handleApprove} disabled={!deptId}>
            Approve &amp; assign
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="font-general text-sm text-pink-swirl/60 bg-white/5 rounded-xl px-4 py-3">
          {application.full_name} · {application.email}
        </p>
        <SelectField
          label="Assign to department"
          required
          placeholder="Select department…"
          value={deptId}
          onChange={e => setDeptId(e.target.value)}
          options={departments.map(d => ({ value: d.id, label: d.name }))}
        />
        <p className="font-general text-xs text-pink-swirl/40">
          After approving, share the registration link with this person so they can create their account.
        </p>
      </div>
    </Modal>
  );
};

// ── Application card ──────────────────────────────────────────────────────────

const ApplicationCard = ({
  app,
  departments,
  onAction,
}: {
  app: VolunteerApplication;
  departments: Department[];
  onAction: (app: VolunteerApplication, action: 'approve' | 'reject') => void;
}) => {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const preferredDept = departments.find(d => d.id === app.preferred_department_id);
  const assignedDept  = departments.find(d => d.id === app.assigned_department_id);

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/register`);
    setCopied(true);
    toast.success('Registration link copied');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-cabinet font-bold text-pink-swirl text-base">{app.full_name}</p>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="flex items-center gap-1.5 font-general text-xs text-pink-swirl/50">
              <Mail size={11} /> {app.email}
            </span>
            {app.phone && (
              <span className="flex items-center gap-1.5 font-general text-xs text-pink-swirl/50">
                <Phone size={11} /> {app.phone}
              </span>
            )}
          </div>
        </div>

        {/* Status / dept badges */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {app.status === 'Approved' && assignedDept && (
            <span className="font-cabinet font-bold text-[11px] px-2.5 py-1 rounded-full bg-fluorescence/15 text-fluorescence uppercase tracking-wide">
              {assignedDept.name}
            </span>
          )}
          {app.status === 'Rejected' && (
            <span className="font-cabinet font-bold text-[11px] px-2.5 py-1 rounded-full bg-hot-red/15 text-hot-red uppercase tracking-wide">
              Rejected
            </span>
          )}
          {preferredDept && app.status === 'Pending' && (
            <span className="font-cabinet font-bold text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-pink-swirl/50 uppercase tracking-wide">
              Prefers: {preferredDept.name}
            </span>
          )}
        </div>
      </div>

      {/* Message */}
      {app.message && (
        <p className="font-general text-sm text-pink-swirl/55 leading-relaxed line-clamp-3 border-l-2 border-white/10 pl-3">
          {app.message}
        </p>
      )}

      {/* Actions */}
      {app.status === 'Pending' && (
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            onClick={() => onAction(app, 'approve')}
            className="bg-fluorescence/15 text-fluorescence hover:bg-fluorescence/25 hover:shadow-none"
          >
            Approve &amp; assign
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onAction(app, 'reject')}
          >
            Reject
          </Button>
        </div>
      )}

      {app.status === 'Approved' && (
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 font-general text-xs text-pink-swirl/50 hover:text-waxy-corn transition-colors"
          >
            {copied ? <Check size={12} className="text-fluorescence" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy registration link'}
          </button>
        </div>
      )}
    </motion.div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const TABS: VolunteerApplicationStatus[] = ['Pending', 'Approved', 'Rejected'];

const VolunteersPage = () => {
  const toast = useToast();
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<VolunteerApplicationStatus>('Pending');
  const [approving, setApproving] = useState<VolunteerApplication | null>(null);

  const load = async () => {
    const [appsRes, deptsRes] = await Promise.all([
      supabase.from('volunteer_applications').select('*').order('created_at', { ascending: false }),
      supabase.from('departments').select('*').order('name'),
    ]);
    setApplications((appsRes.data as VolunteerApplication[]) ?? []);
    setDepartments((deptsRes.data as Department[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (app: VolunteerApplication, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      setApproving(app);
      return;
    }
    const { error } = await supabase
      .from('volunteer_applications')
      .update({ status: 'Rejected' })
      .eq('id', app.id);
    if (error) { toast.error('Failed to reject application'); return; }
    toast.info(`${app.full_name}'s application rejected`);
    load();
  };

  const visible = applications.filter(a => a.status === tab);

  const countFor = (s: VolunteerApplicationStatus) =>
    applications.filter(a => a.status === s).length;

  return (
    <div className="max-w-3xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Users size={20} className="text-waxy-corn" />
        <div>
          <h1 className="font-cabinet font-bold text-xl text-pink-swirl">Volunteer Applications</h1>
          <p className="font-general text-xs text-pink-swirl/40">
            Review, approve and assign incoming volunteer interest forms.
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-general text-sm transition-all',
              tab === t
                ? 'bg-waxy-corn text-bitter-liquorice font-medium'
                : 'text-pink-swirl/60 hover:text-pink-swirl'
            )}
          >
            {t}
            <span className={cn(
              'font-cabinet font-bold text-[11px] px-1.5 py-0.5 rounded-md',
              tab === t ? 'bg-bitter-liquorice/20' : 'bg-white/10'
            )}>
              {countFor(t)}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && visible.length === 0 && (
        <div className="flex flex-col items-center py-20 text-pink-swirl/25">
          <Users size={40} strokeWidth={1} className="mb-3" />
          <p className="font-general text-sm">No {tab.toLowerCase()} applications.</p>
        </div>
      )}

      {!loading && visible.length > 0 && (
        <AnimatePresence initial={false}>
          <div className="space-y-3">
            {visible.map(app => (
              <ApplicationCard
                key={app.id}
                app={app}
                departments={departments}
                onAction={handleAction}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Approve modal */}
      {approving && (
        <ApproveModal
          application={approving}
          departments={departments}
          onClose={() => setApproving(null)}
          onApproved={load}
        />
      )}
    </div>
  );
};

export default VolunteersPage;
