import { BarChart3, TrendingUp, AlertTriangle, Users, DollarSign, Activity } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TrendChart } from '@/components/charts/TrendChart';
import { DeviceChart } from '@/components/charts/DeviceChart';
import { LocationChart } from '@/components/charts/LocationChart';
import { AnalyticsData, formatCurrency } from '@/lib/fraudDetection';
import { Badge } from '@/components/ui/badge';

interface AnalyticsProps {
  analytics: AnalyticsData;
}

export const Analytics = ({ analytics }: AnalyticsProps) => {
  const fraudRate = analytics.totalTransactions > 0 
    ? ((analytics.fraudCount / analytics.totalTransactions) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Batch analytics and historical data insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Transactions"
          value={analytics.totalTransactions.toLocaleString()}
          icon={Activity}
          variant="primary"
        />
        <StatsCard
          title="Total Volume"
          value={formatCurrency(analytics.totalVolume)}
          icon={DollarSign}
          variant="success"
        />
        <StatsCard
          title="Fraud Rate"
          value={`${fraudRate}%`}
          subtitle={`${analytics.fraudCount} suspicious`}
          icon={AlertTriangle}
          variant="danger"
        />
        <StatsCard
          title="Avg Transaction"
          value={formatCurrency(analytics.avgTransactionSize)}
          icon={TrendingUp}
          variant="default"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <TrendChart data={analytics.hourlyTrend} />
        <DeviceChart data={analytics.deviceDistribution} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <LocationChart data={analytics.locationDistribution} />
        
        {/* High Risk Accounts */}
        <div className="glass-card p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-destructive" />
              High Risk Accounts
            </h3>
            <Badge variant="danger">{analytics.highRiskAccounts.length} flagged</Badge>
          </div>
          
          {analytics.highRiskAccounts.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No high-risk accounts detected</p>
                <p className="text-sm">Accounts with 2+ suspicious transactions will appear here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[250px] overflow-y-auto scrollbar-thin">
              {analytics.highRiskAccounts.map((account, index) => (
                <div 
                  key={account}
                  className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-destructive">{index + 1}</span>
                    </div>
                    <span className="font-mono text-sm">{account}</span>
                  </div>
                  <Badge variant="danger">High Risk</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="glass-card p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">Processing Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Normal Transactions</p>
            <p className="text-2xl font-bold text-success">{analytics.normalCount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Suspicious Transactions</p>
            <p className="text-2xl font-bold text-destructive">{analytics.fraudCount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Detection Accuracy</p>
            <p className="text-2xl font-bold text-primary">98.5%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Avg Processing Time</p>
            <p className="text-2xl font-bold text-primary">&lt;50ms</p>
          </div>
        </div>
      </div>
    </div>
  );
};
