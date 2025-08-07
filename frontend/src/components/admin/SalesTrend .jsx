import React from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";



const prepareSalesTrend = (orders) => {
    console.log(orders,'====')
    const grouped = {}

    orders.forEach((order) => {
        const date = new Date(order.DeliveryDate || order.createdAt).toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

        grouped[date] = (grouped[date] || 0) + Number(order.TotalAmount);
    });

    return Object.entries(grouped).map(([date, total]) => ({
        date,
        total,
    }));
}

const SalesTrend = ({ orders }) => {
    const data = prepareSalesTrend(orders)

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sales Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" angle={-30} textAnchor="end" interval={0} height={60} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#00C49F" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default SalesTrend