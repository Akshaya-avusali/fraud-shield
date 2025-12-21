import { Link } from 'react-router-dom';
import { Shield, Play, BarChart3, Zap, Database, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArchitectureDiagram } from '@/components/dashboard/ArchitectureDiagram';

interface HomeProps {
  isRunning: boolean;
  onStart: () => void;
}

const features = [
  {
    icon: Zap,
    title: 'Real-Time Detection',
    description: 'Monitor transactions as they happen with sub-second fraud detection using rule-based analytics.'
  },
  {
    icon: Database,
    title: 'Distributed Storage',
    description: 'Data replicated across multiple nodes ensuring no single point of failure.'
  },
  {
    icon: Lock,
    title: 'Fault Tolerant',
    description: 'System continues operating even when nodes fail, with automatic recovery.'
  },
  {
    icon: BarChart3,
    title: 'Batch Analytics',
    description: 'Process historical data for trends, patterns, and high-risk account identification.'
  }
];

export const Home = ({ isRunning, onStart }: HomeProps) => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative text-center max-w-4xl mx-auto px-4">
          <Badge variant="glow" className="mb-6">
            <Shield className="h-3 w-3 mr-1" />
            Big Data Analytics Project
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="gradient-text">Financial Fraud</span>
            <br />
            Detection System
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            A scalable, fault-tolerant big data analytics platform for real-time bank transaction 
            monitoring and fraud detection. Built to demonstrate distributed systems architecture.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {!isRunning ? (
              <Button variant="glow" size="xl" onClick={onStart} className="gap-2">
                <Play className="h-5 w-5" />
                Start System
              </Button>
            ) : (
              <Link to="/live">
                <Button variant="glow" size="xl" className="gap-2">
                  <Zap className="h-5 w-5" />
                  View Live Data
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link to="/analytics">
              <Button variant="outline" size="xl" className="gap-2">
                <BarChart3 className="h-5 w-5" />
                Open Dashboard
              </Button>
            </Link>
          </div>

          {isRunning && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-success font-medium">System is running</span>
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {features.map((feature, index) => (
          <div 
            key={feature.title}
            className="glass-card p-6 border border-border hover:border-primary/30 transition-all duration-300 group animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Architecture Diagram */}
      <section className="px-4">
        <ArchitectureDiagram />
      </section>

      {/* Project Info */}
      <section className="px-4">
        <div className="glass-card p-8 border border-border">
          <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Technology Stack</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  React with TypeScript for frontend
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Recharts for data visualization
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Simulated distributed storage (3 nodes)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Rule-based fraud detection engine
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Key Concepts Demonstrated</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Scalable architecture design
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Data replication for fault tolerance
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Real-time stream processing simulation
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Batch analytics on historical data
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
