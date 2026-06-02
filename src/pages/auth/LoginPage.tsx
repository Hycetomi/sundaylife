import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

const LoginPage = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, password }: FormValues) => {
    const { error } = await signIn(email, password);
    if (error) {
      setError('root', { message: 'Incorrect email or password. Please try again.' });
    }
  };

  return (
    <main className="min-h-screen bg-bitter-liquorice flex items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-night-blue rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-astral-blue rounded-full blur-[100px] opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-pink-swirl rounded-3xl p-10 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-cabinet font-black text-4xl uppercase text-bitter-liquorice tracking-tight">
            Sunday Life
          </h1>
          <p className="font-general text-bitter-liquorice/60 mt-1">Staff Portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-cabinet font-bold text-sm uppercase tracking-wider text-bitter-liquorice">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@sundaylife.org"
              {...register('email')}
              className={cn(
                'w-full px-5 py-3.5 rounded-2xl border-2 bg-white font-general text-bitter-liquorice placeholder:text-bitter-liquorice/30 outline-none transition-colors focus:border-night-blue',
                errors.email ? 'border-hot-red' : 'border-bitter-liquorice/20'
              )}
            />
            {errors.email && (
              <p className="font-general text-sm text-hot-red">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="font-cabinet font-bold text-sm uppercase tracking-wider text-bitter-liquorice">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              className={cn(
                'w-full px-5 py-3.5 rounded-2xl border-2 bg-white font-general text-bitter-liquorice placeholder:text-bitter-liquorice/30 outline-none transition-colors focus:border-night-blue',
                errors.password ? 'border-hot-red' : 'border-bitter-liquorice/20'
              )}
            />
            {errors.password && (
              <p className="font-general text-sm text-hot-red">{errors.password.message}</p>
            )}
          </div>

          {/* Root/auth error */}
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
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <p className="font-general text-sm text-center text-bitter-liquorice/50 mt-6">
          New to the team?{' '}
          <Link to="/register" className="text-bitter-liquorice font-medium hover:text-night-blue transition-colors">
            Create an account
          </Link>
        </p>
      </motion.div>
    </main>
  );
};

export default LoginPage;
