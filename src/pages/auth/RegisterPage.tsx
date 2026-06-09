import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm:  z.string(),
}).refine(d => d.password === d.confirm, {
  message: "Passwords don't match",
  path: ['confirm'],
});

type FormValues = z.infer<typeof schema>;

const Field = ({
  id, label, type, placeholder, registration, error,
}: {
  id: string; label: string; type: string; placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registration: any; error?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="font-cabinet font-bold text-sm uppercase tracking-wider text-bitter-liquorice">
      {label}
    </label>
    <input
      id={id} type={type} placeholder={placeholder}
      autoComplete="new-password"
      {...registration}
      className={cn(
        'w-full px-5 py-3.5 rounded-2xl border-2 bg-white font-general text-bitter-liquorice placeholder:text-bitter-liquorice/30 outline-none transition-colors focus:border-night-blue',
        error ? 'border-hot-red' : 'border-bitter-liquorice/20'
      )}
    />
    {error && <p className="font-general text-sm text-hot-red">{error}</p>}
  </div>
);

const RegisterPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isInvite, setIsInvite] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Detect Supabase invite token in the URL hash
    const params = new URLSearchParams(window.location.hash.substring(1));
    if (params.get('type') === 'invite') {
      setIsInvite(true);
      return;
    }
    // Not an invite — once auth resolves, gate appropriately
    if (!authLoading) {
      if (user) navigate('/dashboard', { replace: true });
      else navigate('/login', { replace: true });
    }
  }, [authLoading, user, navigate]);

  // Populate the display name once auth picks up the invited user's session
  useEffect(() => {
    if (isInvite && user) {
      const name = (user.user_metadata?.full_name as string) ?? '';
      if (name) setInviteName(name);
    }
  }, [isInvite, user]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ password }: FormValues) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError('root', { message: error.message });
      return;
    }
    setDone(true);
    setTimeout(() => navigate('/dashboard', { replace: true }), 1800);
  };

  // Show nothing while auth resolves and we haven't confirmed invite status yet
  if (!isInvite && authLoading) return null;

  return (
    <main className="min-h-screen bg-bitter-liquorice flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-night-blue rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-astral-blue rounded-full blur-[100px] opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-pink-swirl rounded-3xl p-10 shadow-2xl"
      >
        {done ? (
          <div className="flex flex-col items-center text-center gap-5 py-6">
            <CheckCircle size={56} className="text-astral-blue" strokeWidth={1.5} />
            <h2 className="font-cabinet font-black text-3xl uppercase text-bitter-liquorice">You're in!</h2>
            <p className="font-general text-bitter-liquorice/70">
              Your account is set up. Taking you to the dashboard…
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-waxy-corn/15 flex items-center justify-center mx-auto mb-5">
                <Lock size={22} className="text-waxy-corn" strokeWidth={1.5} />
              </div>
              <h1 className="font-cabinet font-black text-4xl uppercase text-bitter-liquorice tracking-tight">
                Set Your Password
              </h1>
              {inviteName ? (
                <p className="font-general text-bitter-liquorice/60 mt-1">
                  Welcome, {inviteName.split(' ')[0]}. Choose a password to activate your account.
                </p>
              ) : (
                <p className="font-general text-bitter-liquorice/60 mt-1">
                  Sunday Life Staff Portal
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              <Field id="password" label="Password" type="password" placeholder="Min. 8 characters"
                registration={register('password')} error={errors.password?.message} />
              <Field id="confirm" label="Confirm Password" type="password" placeholder="Repeat password"
                registration={register('confirm')} error={errors.confirm?.message} />

              {errors.root && (
                <p className="font-general text-sm text-hot-red text-center bg-hot-red/10 rounded-xl px-4 py-2">
                  {errors.root.message}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                className="mt-2 w-full px-8 py-4 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-lg rounded-full shadow-lg transition-all hover:shadow-[0_0_20px_rgba(247,181,0,0.5)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Activating…' : 'Activate Account'}
              </motion.button>
            </form>

            <p className="font-general text-sm text-center text-bitter-liquorice/50 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-bitter-liquorice font-medium hover:text-night-blue transition-colors">
                Sign in
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </main>
  );
};

export default RegisterPage;
