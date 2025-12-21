import { Transaction, formatCurrency, formatTime } from '@/lib/fraudDetection';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TransactionTableProps {
  transactions: Transaction[];
  maxRows?: number;
  showAnimation?: boolean;
}

export const TransactionTable = ({ 
  transactions, 
  maxRows = 20,
  showAnimation = true 
}: TransactionTableProps) => {
  const displayTransactions = transactions.slice(0, maxRows);

  const getDeviceBadgeVariant = (device: string) => {
    switch (device) {
      case 'ATM': return 'secondary';
      case 'UPI': return 'glow';
      case 'POS': return 'outline';
      case 'Online': return 'muted';
      default: return 'secondary';
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Account
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Device
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                  No transactions yet. Start the system to generate data.
                </td>
              </tr>
            ) : (
              displayTransactions.map((tx, index) => (
                <tr 
                  key={tx.transaction_id}
                  className={cn(
                    'transition-colors hover:bg-secondary/20',
                    tx.status === 'Suspicious' && 'bg-destructive/5 hover:bg-destructive/10',
                    showAnimation && index === 0 && 'animate-data-stream'
                  )}
                >
                  <td className="px-4 py-3 font-mono text-sm">
                    {tx.transaction_id}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                    {tx.account_id}
                  </td>
                  <td className={cn(
                    'px-4 py-3 font-mono text-sm font-medium',
                    tx.amount > 100000 ? 'text-warning' : ''
                  )}>
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={tx.transaction_type === 'Debit' ? 'outline' : 'success'}>
                      {tx.transaction_type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getDeviceBadgeVariant(tx.device)}>
                      {tx.device}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-[150px] truncate">
                    {tx.location}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                    {formatTime(tx.timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={tx.status === 'Suspicious' ? 'danger' : 'success'}>
                      {tx.status === 'Suspicious' && (
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                      )}
                      {tx.status}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
