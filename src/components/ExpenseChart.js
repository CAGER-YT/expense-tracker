import { Card, CardContent, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Chart({ income, expenses }) {
    const data = [
        { name: "Income", amount: income.reduce((sum, item) => sum + item.amount, 0) },
        { name: "Expenses", amount: expenses.reduce((sum, item) => sum + item.amount, 0) }
    ];

    return (
        <Card sx={{ marginTop: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Income vs Expenses
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="amount" fill="#8884d8" barSize={60} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
