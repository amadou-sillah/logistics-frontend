import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, Users, DollarSign, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import AreaChart from '../components/charts/AreaChart';
import BarChart from '../components/charts/BarChart';
import DataTable from '../components/tables/DataTable';
import { Skeleton } from '../components/ui/Skeleton';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import ActivityFeed from '../components/activity/ActivityFeed';

const columns = [
  { key: 'trackingNumber', header: 'ID' },
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
    ),
  },
  { key: 'amount', header: 'Amount', render: (val: number) => `$${val?.toFixed(2) || '0.00'}` },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [chartData, setChartData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [recentShipments, setRecentShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, chartRes, barRes, shipmentsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/weekly-shipments'),
        api.get('/dashboard/status-distribution'),
        api.get('/dashboard/recent-shipments'),
      ]);
      setStats(statsRes.data);
      setChartData(chartRes.data);
      setBarData(barRes.data);
      setRecentShipments(shipmentsRes.data);
      setLastUpdated(new Date());
      setIsLive(true);
      setError(null);
    } catch (err: any) {
      console.error('❌ API Error:', err);
      setError(err.message || 'Failed to load data from server');
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <Skeleton className="mt-8 h-96 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-8 text-center dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">⚠️ {error}</p>
        <button
          onClick={fetchData}
          className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const iconMap: Record<string, any> = { Package, Truck, Users, DollarSign };
  const mappedStats = stats.map((s: any) => ({
    ...s,
    icon: iconMap[s.icon] || Package,
    rawValue: parseInt(s.value.replace(/,/g, '')) || 0,
  }));

  if (!stats.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-secondary-500">No data available</p>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-wrap items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-secondary-500">
            Welcome back, {user?.name || 'User'}! 👋
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-secondary-500">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
          {isLive && (
            <span className="flex items-center gap-1 text-green-500">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          )}
        </div>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mappedStats.map((stat: any, idx: number) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {stat.rawValue.toLocaleString()}
                  </p>
                  <div className={`mt-2 flex items-center text-xs ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {stat.change}
                  </div>
                </div>
                <div className="rounded-full bg-primary-50 p-3 dark:bg-primary-900/20">
                  <stat.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-secondary-500">Weekly Shipments</h3>
          <AreaChart data={chartData} />
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-secondary-500">Status Distribution</h3>
          <BarChart data={barData} color="#8b5cf6" />
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-secondary-500">Live Activity</h3>
          <ActivityFeed />
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-secondary-500">Quick Stats</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-primary-50 p-4 dark:bg-primary-900/20">
              <p className="text-2xl font-bold text-primary-600">{stats.length}</p>
              <p className="text-xs text-secondary-500">Total Stats</p>
            </div>
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <p className="text-2xl font-bold text-green-600">🔔</p>
              <p className="text-xs text-secondary-500">Live Feed</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Recent Shipments</h3>
            <span className="text-xs text-secondary-400">
              Auto‑refresh every 30s
            </span>
          </div>
          <DataTable data={recentShipments} columns={columns} pageSize={4} />
        </Card>
      </div>
    </div>
  );
}
