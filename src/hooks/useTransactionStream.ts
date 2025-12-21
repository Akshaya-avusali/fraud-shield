import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Transaction, 
  NodeStatus, 
  FraudAlert, 
  AnalyticsData,
  generateTransaction, 
  calculateAnalytics,
  initializeNodes 
} from '@/lib/fraudDetection';

interface TransactionStreamState {
  isRunning: boolean;
  transactions: Transaction[];
  fraudAlerts: FraudAlert[];
  nodes: NodeStatus[];
  analytics: AnalyticsData;
  transactionsPerSecond: number;
}

export const useTransactionStream = (maxTransactions = 1000) => {
  const [state, setState] = useState<TransactionStreamState>({
    isRunning: false,
    transactions: [],
    fraudAlerts: [],
    nodes: initializeNodes(),
    analytics: {
      totalTransactions: 0,
      fraudCount: 0,
      normalCount: 0,
      totalVolume: 0,
      avgTransactionSize: 0,
      highRiskAccounts: [],
      hourlyTrend: [],
      deviceDistribution: [],
      locationDistribution: []
    },
    transactionsPerSecond: 0
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const txCountRef = useRef(0);
  const lastSecondRef = useRef(Date.now());

  const addTransaction = useCallback(() => {
    const newTx = generateTransaction();
    
    setState(prev => {
      // Add transaction
      const newTransactions = [newTx, ...prev.transactions].slice(0, maxTransactions);
      
      // Create fraud alert if suspicious
      let newAlerts = prev.fraudAlerts;
      if (newTx.status === 'Suspicious') {
        const alert: FraudAlert = {
          id: `ALERT-${Date.now()}`,
          transaction: newTx,
          alertType: newTx.fraud_reason?.includes('amount') ? 'High Amount' :
                     newTx.fraud_reason?.includes('location') ? 'Location Anomaly' :
                     newTx.fraud_reason?.includes('velocity') ? 'Velocity' : 'Device Anomaly',
          severity: newTx.amount > 500000 ? 'critical' : 
                   newTx.amount > 200000 ? 'high' : 
                   newTx.amount > 100000 ? 'medium' : 'low',
          timestamp: new Date()
        };
        newAlerts = [alert, ...prev.fraudAlerts].slice(0, 100);
      }

      // Update node stats (distribute across active nodes)
      const activeNodes = prev.nodes.filter(n => n.status === 'active');
      const nodeToUpdate = activeNodes[Math.floor(Math.random() * activeNodes.length)];
      
      const updatedNodes = prev.nodes.map(node => {
        if (node.id === nodeToUpdate?.id) {
          return {
            ...node,
            transactions: node.transactions + 1,
            lastSync: new Date(),
            dataSize: `${((node.transactions + 1) * 0.5).toFixed(1)} MB`
          };
        }
        // Replicate to one other active node
        const shouldReplicate = activeNodes.length > 1 && 
          node.status === 'active' && 
          node.id !== nodeToUpdate?.id && 
          Math.random() > 0.5;
        
        if (shouldReplicate) {
          return {
            ...node,
            transactions: node.transactions + 1,
            lastSync: new Date(),
            dataSize: `${((node.transactions + 1) * 0.5).toFixed(1)} MB`
          };
        }
        return node;
      });

      // Calculate TPS
      txCountRef.current++;
      const now = Date.now();
      let tps = prev.transactionsPerSecond;
      if (now - lastSecondRef.current >= 1000) {
        tps = txCountRef.current;
        txCountRef.current = 0;
        lastSecondRef.current = now;
      }

      return {
        ...prev,
        transactions: newTransactions,
        fraudAlerts: newAlerts,
        nodes: updatedNodes,
        analytics: calculateAnalytics(newTransactions),
        transactionsPerSecond: tps
      };
    });
  }, [maxTransactions]);

  const startStream = useCallback(() => {
    if (intervalRef.current) return;
    
    setState(prev => ({ ...prev, isRunning: true }));
    
    // Generate transactions at variable rate (50-200ms interval)
    const generateAtRate = () => {
      addTransaction();
      const nextInterval = Math.floor(Math.random() * 150) + 50;
      intervalRef.current = setTimeout(generateAtRate, nextInterval);
    };
    
    generateAtRate();
  }, [addTransaction]);

  const stopStream = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const toggleNode = useCallback((nodeId: string) => {
    setState(prev => {
      const activeCount = prev.nodes.filter(n => n.status === 'active').length;
      const node = prev.nodes.find(n => n.id === nodeId);
      
      // Don't allow disabling if only one active node
      if (activeCount <= 1 && node?.status === 'active') {
        return prev;
      }

      return {
        ...prev,
        nodes: prev.nodes.map(n => 
          n.id === nodeId 
            ? { ...n, status: n.status === 'active' ? 'failed' : 'active' }
            : n
        )
      };
    });
  }, []);

  const clearData = useCallback(() => {
    setState({
      isRunning: false,
      transactions: [],
      fraudAlerts: [],
      nodes: initializeNodes(),
      analytics: {
        totalTransactions: 0,
        fraudCount: 0,
        normalCount: 0,
        totalVolume: 0,
        avgTransactionSize: 0,
        highRiskAccounts: [],
        hourlyTrend: [],
        deviceDistribution: [],
        locationDistribution: []
      },
      transactionsPerSecond: 0
    });
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    startStream,
    stopStream,
    toggleNode,
    clearData
  };
};
