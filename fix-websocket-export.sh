#!/bin/bash
set -e

echo "🔧 Fixing WebSocket hook export..."

cat > src/hooks/useWebSocket.ts << 'EOF'
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WS_URL } from '../utils/constants';
import toast from 'react-hot-toast';

export function useTrackingSocket() {
  const [updates, setUpdates] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io(WS_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('🔌 Socket.IO connected');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('🔌 Socket.IO disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('tracking-update', (data) => {
      console.log('📡 Received update:', data);
      setUpdates((prev) => [...prev, data]);
      toast.success(`📍 ${data.trackingNumber}: ${data.status}`);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const subscribe = (trackingNumber: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join-shipment', trackingNumber);
      console.log(`📡 Subscribed to ${trackingNumber}`);
    } else {
      console.warn('Socket not connected, cannot subscribe');
    }
  };

  const unsubscribe = (trackingNumber: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave-shipment', trackingNumber);
      console.log(`📡 Unsubscribed from ${trackingNumber}`);
    }
  };

  const clearUpdates = () => setUpdates([]);

  return { updates, subscribe, unsubscribe, clearUpdates, isConnected };
}
