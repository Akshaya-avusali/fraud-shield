import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DeviceChartProps {
  data: { device: string; count: number }[];
}

const COLORS = [
  'hsl(185, 75%, 50%)',
  'hsl(142, 70%, 45%)',
  'hsl(38, 92%, 55%)',
  'hsl(262, 70%, 55%)',
];

export const DeviceChart = ({ data }: DeviceChartProps) => {
  const filteredData = data.filter(d => d.count > 0);

  return (
    <div className="glass-card p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Transactions by Device</h3>
      <div className="h-[300px]">
        {filteredData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
                nameKey="device"
              >
                {filteredData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 20%, 10%)',
                  border: '1px solid hsl(222, 15%, 20%)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelStyle={{ color: 'hsl(210, 20%, 92%)' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
