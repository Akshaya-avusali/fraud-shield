import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface TrendChartProps {
  data: { hour: string; count: number; fraud: number }[];
}

export const TrendChart = ({ data }: TrendChartProps) => {
  // Take last 12 hours for cleaner display
  const displayData = data.slice(-12);

  return (
    <div className="glass-card p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Transaction Trend</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(185, 75%, 50%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(185, 75%, 50%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 15%, 20%)" />
            <XAxis 
              dataKey="hour" 
              stroke="hsl(215, 15%, 55%)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(215, 15%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222, 20%, 10%)', 
                border: '1px solid hsl(222, 15%, 20%)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              labelStyle={{ color: 'hsl(210, 20%, 92%)' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              name="Total"
              stroke="hsl(185, 75%, 50%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
            <Area
              type="monotone"
              dataKey="fraud"
              name="Fraud"
              stroke="hsl(0, 72%, 55%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorFraud)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
