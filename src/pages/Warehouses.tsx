import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Warehouse, Plus, Trash2, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DataTable from '../components/tables/DataTable';
import api from '../services/api';
import toast from 'react-hot-toast';

interface WarehouseItem {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentCapacity: number;
}

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', capacity: 0 });

  const fetchWarehouses = async () => {
    try {
      const res = await api.get('/warehouses');
      setWarehouses(res.data);
    } catch (err) {
      toast.error('Failed to load warehouses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWarehouses(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this warehouse?')) return;
    try {
      await api.delete(`/warehouses/${id}`);
      toast.success('Warehouse deleted');
      setWarehouses(warehouses.filter(w => w.id !== id));
    } catch (err) {
      toast.error('Failed to delete warehouse');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/warehouses', formData);
      toast.success('Warehouse created');
      setWarehouses([res.data, ...warehouses]);
      setShowModal(false);
      setFormData({ name: '', location: '', capacity: 0 });
    } catch (err) {
      toast.error('Failed to create warehouse');
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'location', header: 'Location' },
    { key: 'capacity', header: 'Capacity' },
    { key: 'currentCapacity', header: 'Used' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: WarehouseItem) => (
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
          <h1 className="text-3xl font-bold">Warehouses</h1>
          <p className="text-secondary-500">Manage warehouse locations</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="h-4 w-4" />}>Add Warehouse</Button>
      </motion.div>
      <Card className="p-6">
        <DataTable data={warehouses} columns={columns} pageSize={5} />
      </Card>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Warehouse</h3>
              <button onClick={() => setShowModal(false)} className="text-secondary-500 hover:text-secondary-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-secondary-300 px-3 py-2 dark:border-secondary-600 dark:bg-secondary-900" required />
              <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-lg border border-secondary-300 px-3 py-2 dark:border-secondary-600 dark:bg-secondary-900" required />
              <input type="number" placeholder="Capacity" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })} className="w-full rounded-lg border border-secondary-300 px-3 py-2 dark:border-secondary-600 dark:bg-secondary-900" required />
              <Button type="submit" className="w-full">Create</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
