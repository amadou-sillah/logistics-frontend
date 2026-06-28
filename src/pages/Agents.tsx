import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Trash2, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DataTable from '../components/tables/DataTable';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Agent {
  id: string;
  userId: string;
  vehicleNumber: string;
  phoneNumber: string;
  active: boolean;
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ userId: '', vehicleNumber: '', phoneNumber: '' });

  const fetchAgents = async () => {
    try {
      const res = await api.get('/agentss');
      setAgents(res.data);
    } catch (err) {
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAgents(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this agent?')) return;
    try {
      await api.delete(`/agentss/${id}`);
      toast.success('Agent deleted');
      setAgents(agents.filter(a => a.id !== id));
    } catch (err) {
      toast.error('Failed to delete agent');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/agentss', formData);
      toast.success('Agent created');
      setAgents([res.data, ...agents]);
      setShowModal(false);
      setFormData({ userId: '', vehicleNumber: '', phoneNumber: '' });
    } catch (err) {
      toast.error('Failed to create agent');
    }
  };

  const columns = [
    { key: 'userId', header: 'User ID' },
    { key: 'vehicleNumber', header: 'Vehicle' },
    { key: 'phoneNumber', header: 'Phone' },
    { key: 'active', header: 'Active', render: (val: boolean) => val ? '✅' : '❌' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: Agent) => (
        <Button variant="danger" size="sm" icon={<Trash2 className="h-4 w-4" />} onClick={() => handleDelete(row.id)}>
          Delete
        </Button>
      )
    }
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Delivery Agents</h1>
          <p className="text-secondary-500">Manage delivery agents</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="h-4 w-4" />}>Add Agent</Button>
      </motion.div>
      <Card className="p-6">
        <DataTable data={agents} columns={columns} pageSize={5} />
      </Card>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Agent</h3>
              <button onClick={() => setShowModal(false)} className="text-secondary-500 hover:text-secondary-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" placeholder="User ID" value={formData.userId} onChange={(e) => setFormData({ ...formData, userId: e.target.value })} className="w-full rounded-lg border border-secondary-300 px-3 py-2 dark:border-secondary-600 dark:bg-secondary-900" required />
              <input type="text" placeholder="Vehicle Number" value={formData.vehicleNumber} onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })} className="w-full rounded-lg border border-secondary-300 px-3 py-2 dark:border-secondary-600 dark:bg-secondary-900" required />
              <input type="text" placeholder="Phone Number" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className="w-full rounded-lg border border-secondary-300 px-3 py-2 dark:border-secondary-600 dark:bg-secondary-900" required />
              <Button type="submit" className="w-full">Create</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
