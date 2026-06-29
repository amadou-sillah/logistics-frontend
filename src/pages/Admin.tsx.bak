import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Plus, Trash2, X, Download } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DataTable from '../components/tables/DataTable';
import { Skeleton } from '../components/ui/Skeleton';
import api from '../services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  amount: number;
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    amount: 0,
    priority: 'STANDARD'
  });

  const fetchData = async () => {
    try {
      const [usersRes, shipmentsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/shipments')
      ]);
      setUsers(usersRes.data);
      setShipments(shipmentsRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteShipment = async (shipmentId: string) => {
    if (!confirm('Delete this shipment?')) return;
    try {
      await api.delete(`/shipments/${shipmentId}`);
      toast.success('Shipment deleted');
      setShipments(shipments.filter(s => s.id !== shipmentId));
    } catch (err) {
      toast.error('Failed to delete shipment');
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/shipments', {
        ...formData,
        customerId: 'admin',
      });
      toast.success('Shipment created');
      setShipments([res.data, ...shipments]);
      setShowCreateModal(false);
      setFormData({ origin: '', destination: '', amount: 0, priority: 'STANDARD' });
    } catch (err) {
      toast.error('Failed to create shipment');
    }
  };

  const exportCSV = () => {
    if (shipments.length === 0) {
      toast.error('No shipments to export');
      return;
    }
    const headers = 'Tracking,Status,Origin,Destination,Amount\n';
    const rows = shipments.map(s =>
      `${s.trackingNumber},${s.status},${s.origin},${s.destination},${s.amount || 0}`
    ).join('\n');
    const csv = headers + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shipments.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported shipments');
  };

  const userColumns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row: User) => (
        <Button
          variant="danger"
          size="sm"
          icon={<Trash2 className="h-4 w-4" />}
          onClick={() => handleDeleteUser(row.id)}
        >
          Delete
        </Button>
      )
    }
  ];

  const shipmentColumns = [
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
      render: (_, row: Shipment) => (
        <Button
          variant="danger"
          size="sm"
          icon={<Trash2 className="h-4 w-4" />}
          onClick={() => handleDeleteShipment(row.id)}
        >
          Delete
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-secondary-500">Manage users, shipments, and system settings</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportCSV} icon={<Download className="h-4 w-4" />}>
            Export CSV
          </Button>
          <Button onClick={() => setShowCreateModal(true)} icon={<Plus className="h-4 w-4" />}>
            Create Shipment
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" /> Users
          </h2>
          <DataTable data={users} columns={userColumns} pageSize={5} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" /> All Shipments
          </h2>
          <DataTable data={shipments} columns={shipmentColumns} pageSize={5} />
        </Card>
      </div>

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create New Shipment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-secondary-500 hover:text-secondary-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Origin</label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="w-full rounded-lg border border-secondary-300 px-3 py-2 dark:border-secondary-600 dark:bg-secondary-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Destination</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full rounded-lg border border-secondary-300 px-3 py-2 dark:border-secondary-600 dark:bg-secondary-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="w-full rounded-lg border border-secondary-300 px-3 py-2 dark:border-secondary-600 dark:bg-secondary-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full rounded-lg border border-secondary-300 px-3 py-2 dark:border-secondary-600 dark:bg-secondary-900"
                >
                  <option value="STANDARD">Standard</option>
                  <option value="EXPRESS">Express</option>
                  <option value="INTERNATIONAL">International</option>
                </select>
              </div>
              <Button type="submit" className="w-full">Create</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
