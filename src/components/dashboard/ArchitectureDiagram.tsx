import { Database, Server, Shield, Activity, AlertTriangle, BarChart3 } from 'lucide-react';

export const ArchitectureDiagram = () => {
  return (
    <div className="glass-card p-8 border border-border">
      <h3 className="text-lg font-semibold mb-6 text-center">System Architecture</h3>
      
      <div className="relative">
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid-pattern bg-[size:20px_20px] opacity-20 rounded-lg" />
        
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
          {/* Data Sources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-primary text-center mb-4">Data Sources</h4>
            <div className="space-y-3">
              {['ATM Network', 'UPI Gateway', 'POS Terminals', 'Online Banking'].map((source, i) => (
                <div 
                  key={source}
                  className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-sm">{source}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Processing Layer */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-primary text-center mb-4">Processing Layer</h4>
            <div className="relative p-6 bg-primary/5 rounded-xl border border-primary/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-4 mt-2">
                <div className="p-3 bg-secondary/50 rounded-lg border border-border text-center">
                  <AlertTriangle className="h-4 w-4 text-warning mx-auto mb-1" />
                  <span className="text-xs">Fraud Detection</span>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg border border-border text-center">
                  <BarChart3 className="h-4 w-4 text-primary mx-auto mb-1" />
                  <span className="text-xs">Analytics Engine</span>
                </div>
              </div>
            </div>
            
            {/* Arrows */}
            <div className="flex justify-center gap-2">
              <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
            </div>
          </div>

          {/* Storage Layer */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-primary text-center mb-4">Distributed Storage</h4>
            <div className="grid grid-cols-1 gap-3">
              {['Node 1 (Primary)', 'Node 2 (Secondary)', 'Node 3 (Backup)'].map((node, i) => (
                <div 
                  key={node}
                  className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/30 animate-slide-up"
                  style={{ animationDelay: `${(i + 4) * 100}ms` }}
                >
                  <Database className="h-4 w-4 text-success" />
                  <span className="text-sm">{node}</span>
                  <span className="ml-auto h-2 w-2 rounded-full bg-success animate-pulse" />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Data replicated across nodes for fault tolerance
            </p>
          </div>
        </div>

        {/* Connection lines - simplified for mobile */}
        <div className="hidden md:block absolute top-1/2 left-[33%] w-[10%] h-px bg-gradient-to-r from-primary/50 to-primary" />
        <div className="hidden md:block absolute top-1/2 right-[33%] w-[10%] h-px bg-gradient-to-r from-primary to-success/50" />
      </div>
    </div>
  );
};
