import { NodeStatus } from '@/lib/fraudDetection';
import { Server, CheckCircle, XCircle, HardDrive, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NodeCardProps {
  node: NodeStatus;
  onToggle: (nodeId: string) => void;
  canDisable: boolean;
}

export const NodeCard = ({ node, onToggle, canDisable }: NodeCardProps) => {
  const isActive = node.status === 'active';

  return (
    <div className={cn(
      'glass-card p-6 border-2 transition-all duration-300',
      isActive 
        ? 'border-success/30 glow-success' 
        : 'border-destructive/30 glow-danger opacity-60'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-3 rounded-lg',
            isActive ? 'bg-success/20' : 'bg-destructive/20'
          )}>
            <Server className={cn(
              'h-6 w-6',
              isActive ? 'text-success' : 'text-destructive'
            )} />
          </div>
          <div>
            <h3 className="font-semibold">{node.name}</h3>
            <Badge variant={isActive ? 'success' : 'danger'} className="mt-1">
              {isActive ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Failed
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            Transactions Stored
          </span>
          <span className="font-mono font-medium">{node.transactions.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Last Sync
          </span>
          <span className="font-mono text-muted-foreground">
            {node.lastSync.toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Data Size</span>
          <span className="font-mono font-medium">{node.dataSize}</span>
        </div>
      </div>

      {/* Progress bar for data */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-4">
        <div 
          className={cn(
            'h-full transition-all duration-500',
            isActive ? 'bg-success' : 'bg-destructive'
          )}
          style={{ width: `${Math.min((node.transactions / 500) * 100, 100)}%` }}
        />
      </div>

      <Button
        variant={isActive ? 'danger' : 'success'}
        size="sm"
        className="w-full"
        onClick={() => onToggle(node.id)}
        disabled={isActive && !canDisable}
      >
        {isActive ? 'Simulate Failure' : 'Recover Node'}
      </Button>
      
      {isActive && !canDisable && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          At least one node must remain active
        </p>
      )}
    </div>
  );
};
