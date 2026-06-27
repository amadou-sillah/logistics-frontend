import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DataTable from '../components/tables/DataTable';
import { Skeleton } from '../components/ui/Skeleton';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Task {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: string;
  amount: number;
}

export default function Agent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/agent/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await api.patch(`/agent/tasks/${taskId}?status=${newStatus}`);
      toast.success(`Status updated to ${newStatus}`);
      // Update local state
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const columns = [
    { key: 'trackingNumber', header: 'Tracking' },
    { key: 'origin', header: 'Origin' },
    { key: 'destination', header: 'Destination' },
    {
      key: 'status',
      header: 'Status',
      render: (val: string) => (
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
          val === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
          val === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
        }`}>{val}</span>
      )
    },
    { key: 'amount', header: 'Amount', render: (val: number) => `$${val?.toFixed(2) || '0.00'}` },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row: Task) => (
        <div className="flex gap-2">
          {row.status !== 'IN_TRANSIT' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => updateStatus(row.id, 'IN_TRANSIT')}
            >
              Start
            </Button>
          )}
          {row.status !== 'DELIVERED' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => updateStatus(row.id, 'DELIVERED')}
            >
              Deliver
            </Button>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Truck className="h-7 w-7" /> Agent Tasks
        </h1>
        <p className="text-secondary-500">Manage your delivery assignments</p>
      </motion.div>

      <Card className="p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-secondary-500">
            <Clock className="h-12 w-12 mx-auto mb-3 text-secondary-300" />
            <p>No pending or in‑transit tasks.</p>
          </div>
        ) : (
          <DataTable data={tasks} columns={columns} pageSize={5} />
        )}
      </Card>
    </div>
  );
}
