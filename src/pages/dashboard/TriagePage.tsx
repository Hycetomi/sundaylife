import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui';
import TriageQueue from '@/components/dashboard/TriageQueue';
import TaskCreatorForm from '@/components/dashboard/TaskCreatorForm';
import type { TaskTemplate } from '@/types';

const TriagePage = () => {
  const [refreshKey, setRefreshKey]           = useState(0);
  const [showForm, setShowForm]               = useState(false);
  const [templates, setTemplates]             = useState<TaskTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);

  useEffect(() => {
    supabase
      .from('task_templates')
      .select('*')
      .then(({ data }) => setTemplates((data as TaskTemplate[]) ?? []));
  }, []);

  const handleTemplateChange = (id: string) => {
    setSelectedTemplate(templates.find(t => t.id === id) ?? null);
  };

  const handleCreated = () => {
    setShowForm(false);
    setSelectedTemplate(null);
    setRefreshKey(k => k + 1);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="max-w-5xl space-y-6">

      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <p className="font-general text-sm text-pink-swirl/50">
          Assign incoming requests to your team or submit a new task.
        </p>
        <Button icon={<Plus size={15} />} onClick={() => setShowForm(v => !v)}>
          New Task
        </Button>
      </div>

      {/* Full-width form panel */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <TaskCreatorForm
              templates={templates}
              selectedTemplate={selectedTemplate}
              onTemplateChange={handleTemplateChange}
              onCreated={handleCreated}
              onClose={handleClose}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <TriageQueue key={refreshKey} />
    </div>
  );
};

export default TriagePage;
