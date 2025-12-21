import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Home } from '@/pages/Home';
import { LiveTransactions } from '@/pages/LiveTransactions';
import { FraudAlerts } from '@/pages/FraudAlerts';
import { Analytics } from '@/pages/Analytics';
import { FaultTolerance } from '@/pages/FaultTolerance';
import { useTransactionStream } from '@/hooks/useTransactionStream';

const Index = () => {
  const {
    isRunning,
    transactions,
    fraudAlerts,
    nodes,
    analytics,
    transactionsPerSecond,
    startStream,
    stopStream,
    toggleNode,
    clearData
  } = useTransactionStream();

  return (
    <div className="min-h-screen bg-background">
      <Header isRunning={isRunning} fraudCount={fraudAlerts.length} />
      
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                isRunning={isRunning} 
                onStart={startStream} 
              />
            } 
          />
          <Route 
            path="/live" 
            element={
              <LiveTransactions 
                transactions={transactions}
                isRunning={isRunning}
                transactionsPerSecond={transactionsPerSecond}
                onStart={startStream}
                onStop={stopStream}
                onClear={clearData}
              />
            } 
          />
          <Route 
            path="/alerts" 
            element={<FraudAlerts alerts={fraudAlerts} />} 
          />
          <Route 
            path="/analytics" 
            element={<Analytics analytics={analytics} />} 
          />
          <Route 
            path="/nodes" 
            element={
              <FaultTolerance 
                nodes={nodes}
                onToggleNode={toggleNode}
                isRunning={isRunning}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Financial Fraud Detection System — Big Data Analytics Project</p>
          <p className="mt-1">Demonstrating Scalable, Fault-Tolerant Architecture</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
