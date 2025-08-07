// components/charts/BestSellerChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-gray-800">{label}</p>
        <p className="text-sm text-gray-600">
          Quantity: <span className="font-semibold">{payload[0].value}</span>
        </p>
        <p className="text-sm text-gray-600">
          Revenue: <span className="font-semibold">₹{payload[0].payload.revenue?.toFixed(2) || 0}</span>
        </p>
      </div>
    );
  }
  return null;
};

const BestSellerChart = ({ title, data, colors = ["#4285F4", "#34A853", "#FBBC05", "#EA4335"] }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-6 text-gray-800">{title}</h2>
      <div className="w-full h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              stroke="#4285F4"
              label={{ 
                value: 'Quantity', 
                angle: -90, 
                position: 'insideLeft',
                fontSize: 14,
                fill: '#4285F4'
              }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#34A853"
              label={{ 
                value: 'Revenue (₹)', 
                angle: 90, 
                position: 'insideRight',
                fontSize: 14,
                fill: '#34A853'
              }}
              
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '30px' 
              }}
            />
            <Bar 
              yAxisId="left"
              dataKey="quantity" 
              name="Quantity Sold"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
            <Bar 
              yAxisId="right"
              dataKey="revenue" 
              name="Revenue (₹)"
              fill="#34A853"
              opacity={0.7}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BestSellerChart;