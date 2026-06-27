import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useTrackingSocket } from '../../hooks/useWebSocket';

interface Activity {
  id: string;
  type: 'created' | 'status' | 'delivered';
  message: string;
  timestamp: Date;
}

export default function ActivityFeed() {
  const { updates } = useTrackingSocket();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (updates.length > 0) {
      const latest = updates[updates.length - 1];
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: latest.status === 'DELIVERED' ? 'delivered' : 'status',
        message: `Shipment ${latest.trackingNumber} status: ${latest.status}`,
        timestamp: new Date(),
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 10));
    }
  }, [updates]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'created': return <Package className="h-4 w-4 text-blue-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Truck className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-3 max-h-48 overflow-y-auto">
      {activities.length === 0 ? (
        <p className="text-sm text-secondary-500">No recent activity</p>
      ) : (
        activities.map((act) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-2 rounded-lg bg-secondary-50 dark:bg-secondary-800/50"
          >
            {getIcon(act.type)}
            <div className="flex-1">
              <p className="text-sm">{act.message}</p>
              <p className="text-xs text-secondary-500">
                {act.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
