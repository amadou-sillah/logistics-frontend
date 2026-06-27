import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FloatingInput from '../components/forms/FloatingInput';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../services/api';

interface ProfileForm {
  name: string;
  email: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      // In a real app, you'd have a PUT /users/{id} endpoint.
      // We'll just show a success toast for now.
      toast.success('Profile updated (mock)');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <Card className="p-6 max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FloatingInput
            label="Full Name"
            name="name"
            control={control}
            type="text"
            required
          />
          <FloatingInput
            label="Email"
            name="email"
            control={control}
            type="email"
            required
            disabled
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
