import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import Card from '../components/ui/Card';
import DataTable from '../components/tables/DataTable';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/audit-logs');
        setLogs(res.data);
      } catch (err) {
        toast.error('Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const columns = [
    { key: 'userId', header: 'User' },
    { key: 'action', header: 'Action' },
    { key: 'entityType', header: 'Entity' },
    { key: 'timestamp', header: 'Timestamp' }
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2"><History className="h-7 w-7" /> Audit Logs</h1>
        <p className="text-secondary-500">Track all user actions</p>
      </motion.div>
      <Card className="p-6">
        <DataTable data={logs} columns={columns} pageSize={10} />
      </Card>
    </div>
  );
}
