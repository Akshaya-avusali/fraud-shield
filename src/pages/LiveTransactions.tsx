import { Activity, Play, Pause, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TransactionTable } from '@/components/dashboard/TransactionTable';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Transaction, formatCurrency } from '@/lib/fraudDetection';

interface LiveTransactionsProps {
  transactions: Transaction[];
  isRunning: boolean;
  transactionsPerSecond: number;
  onStart: () => void;
  onStop: () => void;
  onClear: () => void;
}

export const LiveTransactions = ({
  transactions,
  isRunning,
  transactionsPerSecond,
  onStart,
  onStop,
  onClear
}: LiveTransactionsProps) => {
  const fraudCount = transactions.filter(t => t.status === 'Suspicious').length;
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Activity className="h-6 w-6 text-primary" />
            Live Transactions
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time transaction stream with fraud detection
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isRunning ? (
            <Button variant="outline" onClick={onStop} className="gap-2">
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          ) : (
            <Button variant="glow" onClick={onStart} className="gap-2">
              <Play className="h-4 w-4" />
              Start
            </Button>
          )}
          <Button variant="ghost" onClick={onClear} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Transactions"
          value={transactions.length.toLocaleString()}
          icon={Activity}
          variant="primary"
        />
        <StatsCard
          title="Transactions/sec"
          value={transactionsPerSecond}
          subtitle={isRunning ? 'Live' : 'Paused'}
          icon={Zap}
          variant="default"
        />
        <StatsCard
          title="Total Volume"
          value={formatCurrency(totalVolume)}
          icon={Activity}
          variant="success"
        />
        <StatsCard
          title="Fraud Detected"
          value={fraudCount}
          subtitle={`${transactions.length > 0 ? ((fraudCount / transactions.length) * 100).toFixed(1) : 0}% rate`}
          icon={Activity}
          variant="danger"
        />
      </div>

      {/* Status Banner */}
      {isRunning && (
        <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="relative">
            <div className="h-3 w-3 rounded-full bg-success" />
            <div className="absolute inset-0 h-3 w-3 rounded-full bg-success animate-ping" />
          </div>
          <div className="flex-1">
            <p className="font-medium">System Active</p>
            <p className="text-sm text-muted-foreground">
              Generating and processing transactions in real-time
            </p>
          </div>
          <Badge variant="glow">{transactionsPerSecond} TPS</Badge>
        </div>
      )}

      {/* Transaction Table */}
      <TransactionTable 
        transactions={transactions} 
        maxRows={50}
        showAnimation={isRunning}
      />

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="success">Normal</Badge>
          <span>Legitimate transaction</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="danger">Suspicious</Badge>
          <span>Flagged for review</span>
        </div>
      </div>
    </div>
  );
};
