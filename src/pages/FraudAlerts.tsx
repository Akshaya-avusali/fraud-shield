import { AlertTriangle, AlertCircle, Info, XCircle, Clock, MapPin, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FraudAlert, formatCurrency, formatTime } from '@/lib/fraudDetection';
import { cn } from '@/lib/utils';

interface FraudAlertsProps {
  alerts: FraudAlert[];
}

const severityConfig = {
  low: { 
    icon: Info, 
    color: 'text-muted-foreground', 
    bg: 'bg-muted/50',
    badge: 'muted' as const
  },
  medium: { 
    icon: AlertCircle, 
    color: 'text-warning', 
    bg: 'bg-warning/10',
    badge: 'warning' as const
  },
  high: { 
    icon: AlertTriangle, 
    color: 'text-destructive', 
    bg: 'bg-destructive/10',
    badge: 'danger' as const
  },
  critical: { 
    icon: XCircle, 
    color: 'text-destructive', 
    bg: 'bg-destructive/20',
    badge: 'destructive' as const
  }
};

export const FraudAlerts = ({ alerts }: FraudAlertsProps) => {
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const highCount = alerts.filter(a => a.severity === 'high').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-warning" />
          Fraud Alerts
        </h1>
        <p className="text-muted-foreground mt-1">
          Suspicious transactions requiring investigation
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Alerts</p>
          <p className="text-2xl font-bold">{alerts.length}</p>
        </div>
        <div className="glass-card p-4 border border-destructive/30 bg-destructive/5">
          <p className="text-sm text-destructive">Critical</p>
          <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
        </div>
        <div className="glass-card p-4 border border-warning/30 bg-warning/5">
          <p className="text-sm text-warning">High Priority</p>
          <p className="text-2xl font-bold text-warning">{highCount}</p>
        </div>
        <div className="glass-card p-4 border border-border">
          <p className="text-sm text-muted-foreground">Pending Review</p>
          <p className="text-2xl font-bold">{alerts.length}</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="glass-card p-12 border border-border text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Alerts</h3>
            <p className="text-muted-foreground">
              Start the system to begin monitoring for fraudulent transactions
            </p>
          </div>
        ) : (
          alerts.slice(0, 50).map((alert, index) => {
            const config = severityConfig[alert.severity];
            const SeverityIcon = config.icon;
            
            return (
              <div 
                key={alert.id}
                className={cn(
                  'glass-card p-5 border transition-all duration-300 hover:shadow-lg animate-slide-up',
                  alert.severity === 'critical' ? 'border-destructive/50 glow-danger' :
                  alert.severity === 'high' ? 'border-destructive/30' :
                  'border-border'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn('p-3 rounded-lg', config.bg)}>
                    <SeverityIcon className={cn('h-5 w-5', config.color)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{alert.alertType}</h3>
                          <Badge variant={config.badge} className="capitalize">
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.transaction.fraud_reason}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Transaction ID</p>
                        <p className="font-mono font-medium">{alert.transaction.transaction_id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Amount</p>
                        <p className="font-mono font-medium text-warning">
                          {formatCurrency(alert.transaction.amount)}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground mb-1">Location</p>
                          <p className="font-medium">{alert.transaction.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground mb-1">Device</p>
                          <p className="font-medium">{alert.transaction.device}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        Investigate
                      </Button>
                      <Button size="sm" variant="ghost">
                        Mark as Reviewed
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
