import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { Lifehouse } from '@/types';

export const useLifehouse = () => {
  const { user } = useAuth();
  const [lifehouse, setLifehouse] = useState<Lifehouse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('lifehouses')
      .select('*')
      .eq('lead_user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setLifehouse(data ?? null);
        setLoading(false);
      });
  }, [user]);

  return { lifehouse, loading };
};
