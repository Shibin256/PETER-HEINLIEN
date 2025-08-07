import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";


const COLORS = ["#4285F4", "#FFBB28", "#00C49F"];

const SalesDistribution = ({ totalSales, totalDiscount }) => {
    const netSales = totalSales - totalDiscount;

    const data = [
        { name: 'Gross Sales', value: totalSales },
        { name: 'Discounts', value: totalDiscount },
        { name: 'Net Sales', value: netSales }
    ]

    return(
         <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Sales Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
    )

}


export default SalesDistribution;