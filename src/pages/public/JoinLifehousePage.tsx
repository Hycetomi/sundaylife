import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const schema = z.object({
  full_name: z.string().min(2, 'Please enter your full name'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  address_area: z.string().min(2, 'Please enter your area or neighbourhood'),
});

type FormValues = z.infer<typeof schema>;

const fields: { name: keyof FormValues; label: string; type: string; placeholder: string }[] = [
  { name: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Jane Doe' },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 8900' },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@example.com' },
  { name: 'address_area', label: 'Area / Neighbourhood', type: 'text', placeholder: 'e.g. Westlands, Nairobi' },
];

const JoinLifehousePage = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    const { error } = await supabase.from('lifehouse_requests').insert([data]);
    if (error) throw new Error(error.message);
    setSubmitted(true);
  };

  return (
    <section className="min-h-screen pt-28 pb-20 bg-pink-swirl flex items-center justify-center px-4">
      <div className="w-full max-w-lg">

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center py-16 flex flex-col items-center gap-6"
            >
              <CheckCircle size={64} className="text-astral-blue" strokeWidth={1.5} />
              <h1 className="font-cabinet font-black text-5xl text-bitter-liquorice uppercase">
                You're In!
              </h1>
              <p className="font-general text-xl text-bitter-liquorice/70 max-w-sm">
                Thanks for reaching out. A Lifehouse leader will connect with you soon.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h1 className="font-cabinet font-black text-5xl md:text-6xl text-bitter-liquorice uppercase mb-3 leading-tight">
                Join a<br />
                <span className="text-hot-red">Lifehouse</span>
              </h1>
              <p className="font-general text-lg text-bitter-liquorice/70 mb-10">
                Community is everything. Fill in your details and we'll match you with the closest Lifehouse group.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
                {fields.map(({ name, label, type, placeholder }) => (
                  <div key={name} className="flex flex-col gap-1.5">
                    <label
                      htmlFor={name}
                      className="font-cabinet font-bold text-sm uppercase tracking-wider text-bitter-liquorice"
                    >
                      {label}
                    </label>
                    <input
                      id={name}
                      type={type}
                      placeholder={placeholder}
                      autoComplete={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'off'}
                      {...register(name)}
                      className={cn(
                        'w-full px-5 py-3.5 rounded-2xl border-2 bg-white font-general text-bitter-liquorice placeholder:text-bitter-liquorice/30 outline-none transition-colors focus:border-night-blue',
                        errors[name] ? 'border-hot-red' : 'border-bitter-liquorice/20'
                      )}
                    />
                    {errors[name] && (
                      <p className="font-general text-sm text-hot-red">{errors[name]?.message}</p>
                    )}
                  </div>
                ))}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  className="mt-2 px-8 py-4 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-lg rounded-full shadow-lg transition-all hover:shadow-[0_0_20px_rgba(247,181,0,0.5)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Connect Me'}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default JoinLifehousePage;
