import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import FloatingInput from '../components/forms/FloatingInput';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';

interface RegistrationForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Registration() {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<RegistrationForm>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const password = watch('password');

  const onSubmit = async (data: RegistrationForm) => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Registration successful! Logging you in...');
      await login(data.email, data.password);
      navigate('/app/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Registration failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-950 dark:to-secondary-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md px-4"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">LogiTrack</h1>
            <p className="text-secondary-500 dark:text-secondary-400 mt-2">Create a new account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FloatingInput
              label="Full Name"
              name="name"
              control={control}
              type="text"
              required
              error={errors.name?.message}
            />
            <FloatingInput
              label="Email"
              name="email"
              control={control}
              type="email"
              required
              error={errors.email?.message}
            />
            <FloatingInput
              label="Password"
              name="password"
              control={control}
              type="password"
              required
              error={errors.password?.message}
            />
            <FloatingInput
              label="Confirm Password"
              name="confirmPassword"
              control={control}
              type="password"
              required
              validate={(value) => value === password || 'Passwords do not match'}
              error={errors.confirmPassword?.message}
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-secondary-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline dark:text-primary-400">
              Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
