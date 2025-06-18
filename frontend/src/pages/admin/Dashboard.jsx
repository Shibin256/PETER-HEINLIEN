import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [salesData, setSalesData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales ($)',
        data: [3000, 3200, 2800, 3500, 4000, 5000],
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  });

  const topProducts = [
    { name: 'Men Watches', sales: 120 },
    { name: 'Women Watches', sales: 80 },
    { name: 'Couples', sales: 75 },
  ];

  const recentOrders = [
    { id: 'ORD001', customer: 'John Doe', amount: 150, status: 'Delivered' },
    { id: 'ORD002', customer: 'Jane Smith', amount: 200, status: 'Pending' },
    { id: 'ORD003', customer: 'Mike Johnson', amount: 175, status: 'Shipped' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
     {/*  */}
    </div>
  );
};

export default Dashboard;