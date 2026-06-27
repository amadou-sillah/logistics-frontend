import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import FloatingInput from '../components/forms/FloatingInput';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: {
      email: 'admin@logistics.com',
      password: 'password'
    }
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Login successful');
      navigate('/app/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
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
            <p className="text-secondary-500 dark:text-secondary-400 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-secondary-500">
            <p>Demo credentials: admin@logistics.com / password</p>
            <p>Agent: agent@logistics.com / password</p>
          <div className="mt-2">
            <Link to="/register" className="text-primary-600 hover:underline dark:text-primary-400">
              Create an account
            </Link>
          </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
