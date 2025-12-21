import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface LocationChartProps {
  data: { location: string; count: number }[];
}

export const LocationChart = ({ data }: LocationChartProps) => {
  // Shorten location names for display
  const formattedData = data.map(d => ({
    ...d,
    shortLocation: d.location.split(',')[0]
  }));

  return (
    <div className="glass-card p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Top Locations</h3>
      <div className="h-[300px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={formattedData} 
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 15%, 20%)" horizontal={false} />
              <XAxis 
                type="number"
                stroke="hsl(215, 15%, 55%)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                type="category"
                dataKey="shortLocation"
                stroke="hsl(215, 15%, 55%)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 20%, 10%)',
                  border: '1px solid hsl(222, 15%, 20%)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelStyle={{ color: 'hsl(210, 20%, 92%)' }}
                formatter={(value: number) => [value, 'Transactions']}
                labelFormatter={(label) => formattedData.find(d => d.shortLocation === label)?.location || label}
              />
              <Bar 
                dataKey="count" 
                radius={[0, 4, 4, 0]}
              >
                {formattedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`hsl(185, 75%, ${50 - index * 5}%)`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
