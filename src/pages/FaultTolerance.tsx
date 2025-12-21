import { Server, Shield, AlertTriangle, CheckCircle, Database, RefreshCw } from 'lucide-react';
import { NodeCard } from '@/components/dashboard/NodeCard';
import { NodeStatus } from '@/lib/fraudDetection';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FaultToleranceProps {
  nodes: NodeStatus[];
  onToggleNode: (nodeId: string) => void;
  isRunning: boolean;
}

export const FaultTolerance = ({ nodes, onToggleNode, isRunning }: FaultToleranceProps) => {
  const activeNodes = nodes.filter(n => n.status === 'active').length;
  const failedNodes = nodes.filter(n => n.status === 'failed').length;
  const totalTransactions = nodes.reduce((sum, n) => sum + n.transactions, 0);
  const canDisableMore = activeNodes > 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Server className="h-6 w-6 text-primary" />
          Fault Tolerance Demo
        </h1>
        <p className="text-muted-foreground mt-1">
          Simulate node failures and observe system resilience
        </p>
      </div>

      {/* System Status Banner */}
      <div className={cn(
        'p-6 rounded-xl border-2 transition-all duration-300',
        failedNodes === 0 
          ? 'bg-success/5 border-success/30' 
          : failedNodes < nodes.length 
            ? 'bg-warning/5 border-warning/30'
            : 'bg-destructive/5 border-destructive/30'
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            'p-4 rounded-full',
            failedNodes === 0 ? 'bg-success/20' : 'bg-warning/20'
          )}>
            {failedNodes === 0 ? (
              <CheckCircle className="h-8 w-8 text-success" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-warning" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">
              {failedNodes === 0 
                ? 'All Systems Operational' 
                : `System Degraded - ${failedNodes} Node(s) Failed`}
            </h2>
            <p className="text-muted-foreground">
              {failedNodes === 0 
                ? 'All nodes are healthy and replicating data correctly.'
                : 'System continues to operate with remaining nodes. Data is preserved through replication.'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{activeNodes}/{nodes.length}</p>
            <p className="text-sm text-muted-foreground">Nodes Active</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Server className="h-4 w-4 text-success" />
            <span className="text-sm text-muted-foreground">Active Nodes</span>
          </div>
          <p className="text-2xl font-bold text-success">{activeNodes}</p>
        </div>
        <div className="glass-card p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Server className="h-4 w-4 text-destructive" />
            <span className="text-sm text-muted-foreground">Failed Nodes</span>
          </div>
          <p className="text-2xl font-bold text-destructive">{failedNodes}</p>
        </div>
        <div className="glass-card p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Total Records</span>
          </div>
          <p className="text-2xl font-bold">{totalTransactions.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Replication</span>
          </div>
          <p className="text-2xl font-bold">2x</p>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {nodes.map(node => (
          <NodeCard 
            key={node.id}
            node={node}
            onToggle={onToggleNode}
            canDisable={canDisableMore}
          />
        ))}
      </div>

      {/* How It Works */}
      <div className="glass-card p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          How Fault Tolerance Works
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="glow">1</Badge>
              <h4 className="font-semibold">Data Replication</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Each transaction is stored on at least 2 nodes. This ensures data availability 
              even if one node fails.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="glow">2</Badge>
              <h4 className="font-semibold">Automatic Failover</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              When a node fails, the system automatically routes requests to healthy nodes 
              without data loss or service interruption.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="glow">3</Badge>
              <h4 className="font-semibold">Recovery</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Failed nodes can be recovered and will sync with the cluster, 
              restoring full redundancy.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Instructions */}
      <div className="glass-card p-6 border border-primary/20 bg-primary/5">
        <h3 className="text-lg font-semibold mb-3">Try It Out</h3>
        <ol className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="font-bold text-primary">1.</span>
            <span>Start the transaction stream from the Live Transactions page</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-primary">2.</span>
            <span>Click "Simulate Failure" on any node above</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-primary">3.</span>
            <span>Observe that the system continues processing transactions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-primary">4.</span>
            <span>Click "Recover Node" to restore the failed node</span>
          </li>
        </ol>
      </div>
    </div>
  );
};
