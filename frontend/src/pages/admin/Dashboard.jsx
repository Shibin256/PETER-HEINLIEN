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
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl font-bold">15,233</p>
          <div className="flex justify-between mt-2">
            <span className="text-blue-500">Payment Completed: 52%</span>
            <span className="text-gray-500">Pending: 48%</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Customers</h2>
          <p className="text-2xl font-bold">13,122</p>
          <p className="text-gray-500">Last 7 Days: <span className="text-red-500">-321</span></p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Sales</h2>
          <p className="text-2xl font-bold">$52,298</p>
          <div className="flex justify-between mt-2">
            <span className="text-blue-500">Cash on Delivery: 22%</span>
            <span className="text-gray-500">Online: 78%</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Income</h2>
          <p className="text-2xl font-bold">$1,533</p>
          <p className="text-gray-500">Last Month Growth: <span className="text-green-500">12%</span></p>
        </div>
      </div>

      {/* Sales Report Graph */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Sales Report</h2>
        <Line data={salesData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>

      {/* Top Selling Products and Recent Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b p-2">Product</th>
                <th className="border-b p-2">Sales</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index}>
                  <td className="border-b p-2">{product.name}</td>
                  <td className="border-b p-2">{product.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b p-2">Order ID</th>
                <th className="border-b p-2">Customer</th>
                <th className="border-b p-2">Amount ($)</th>
                <th className="border-b p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index}>
                  <td className="border-b p-2">{order.id}</td>
                  <td className="border-b p-2">{order.customer}</td>
                  <td className="border-b p-2">{order.amount}</td>
                  <td className="border-b p-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;