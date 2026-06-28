import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Reports() {
  const [shipmentReport, setShipmentReport] = useState<any[]>([]);
  const [deliveryReport, setDeliveryReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [s, d] = await Promise.all([
          api.get('/reports/shipments'),
          api.get('/reports/deliveries')
        ]);
        setShipmentReport(s.data);
        setDeliveryReport(d.data);
      } catch (err) {
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) { toast.error('No data to export'); return; }
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = headers + '\n' + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    toast.success('Exported');
  };

  if (loading) return <div>Loading reports...</div>;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-secondary-500">View and export reports</p>
      </motion.div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="h-5 w-5" /> Shipments</h2>
            <Button variant="secondary" size="sm" icon={<Download className="h-4 w-4" />} onClick={() => exportCSV(shipmentReport, 'shipment-report')}>Export</Button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <pre className="text-xs text-secondary-600 dark:text-secondary-400">{JSON.stringify(shipmentReport.slice(0, 5), null, 2)}</pre>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="h-5 w-5" /> Deliveries</h2>
            <Button variant="secondary" size="sm" icon={<Download className="h-4 w-4" />} onClick={() => exportCSV(deliveryReport, 'delivery-report')}>Export</Button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <pre className="text-xs text-secondary-600 dark:text-secondary-400">{JSON.stringify(deliveryReport.slice(0, 5), null, 2)}</pre>
          </div>
        </Card>
      </div>
    </div>
  );
}
