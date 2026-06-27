import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useSocketIO } from '../hooks/useWebSocket';
import api from '../services/api';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

interface TrackingEvent {
  date: string;
  description: string;
  location?: string;
}

interface TrackingData {
  id: string;
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  eta: string;
  events: TrackingEvent[];
}

export default function Tracking() {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Socket.IO real‑time updates
  const { messages, subscribe, unsubscribe, clearMessages } = useSocketIO('tracking-update');

  // When a new tracking update arrives, merge it
  useEffect(() => {
    if (messages.length && result) {
      const latest = messages[messages.length - 1];
      if (latest.shipmentId === result.trackingNumber) {
        setResult((prev) => ({
          ...prev!,
          status: latest.status,
          events: [
            { date: new Date().toISOString(), description: `Status updated: ${latest.status}`, location: `${latest.lat}, ${latest.lng}` },
            ...(prev?.events || []),
          ],
        }));
        toast.success('📍 Shipment status updated');
      }
    }
  }, [messages, result]);

  const handleSearch = async () => {
    if (!trackingId.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    clearMessages();

    try {
      const response = await api.get(`/tracking/${trackingId}`);
      setResult(response.data);
      subscribe(trackingId);
      toast.success('📡 Subscribed to live updates');
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Shipment not found. Please check the tracking number.');
      } else {
        setError('Failed to fetch tracking data. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup subscription on unmount or when trackingId changes
  useEffect(() => {
    return () => {
      if (trackingId) unsubscribe(trackingId);
    };
  }, [trackingId, unsubscribe]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Track Shipment</h1>
        <p className="text-secondary-500 dark:text-secondary-400">Enter your tracking number</p>
      </motion.div>

      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder=" "
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="peer block w-full rounded-lg border border-secondary-300 bg-transparent px-4 py-3 text-sm placeholder-transparent focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-secondary-700 dark:text-white"
            />
            <label className="absolute left-3 top-3 text-sm text-secondary-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary-400 peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-primary-500 dark:text-secondary-400">
              Tracking Number (e.g., S-1002)
            </label>
          </div>
          <Button onClick={handleSearch} icon={<Search className="h-4 w-4" />} isLoading={loading}>
            Track
          </Button>
        </div>
      </Card>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div className="mt-8 space-y-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      )}

      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="p-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-secondary-500">Shipment ID</p>
                <p className="font-medium">{result.trackingNumber}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Status</p>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  result.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                  result.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {result.status}
                </span>
                {messages.length > 0 && (
                  <span className="ml-2 inline-block text-xs text-blue-500 animate-pulse">
                    ● Live
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-secondary-500">ETA</p>
                <p className="font-medium">{new Date(result.eta).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Route</p>
                <p className="font-medium text-sm">{result.origin} → {result.destination}</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-secondary-500">Tracking Events</h4>
              <div className="mt-3 space-y-3 max-h-60 overflow-y-auto">
                {result.events && result.events.length > 0 ? (
                  result.events.map((event, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        {idx === 0 ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-secondary-300 dark:border-secondary-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm">{event.description}</p>
                        <p className="text-xs text-secondary-500">
                          {new Date(event.date).toLocaleString()}
                          {event.location && ` • ${event.location}`}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-secondary-500">No tracking events available</p>
                )}
                {messages.length > 0 && (
                  <div className="flex items-start space-x-3 animate-pulse">
                    <div className="mt-0.5">
                      <div className="h-5 w-5 rounded-full bg-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Live update received</p>
                      <p className="text-xs text-secondary-500">
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
