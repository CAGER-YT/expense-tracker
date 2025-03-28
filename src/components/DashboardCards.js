import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function Dashboard({ income, expenses }) {
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalSavings = totalIncome - totalExpenses;

    return (
        <Grid container spacing={3} sx={{ marginTop: 2 }}>
            <Grid item xs={12} sm={4}>
                <Card sx={{ backgroundColor: "#e0f7fa" }}>
                    <CardContent>
                        <Typography variant="h6">Total Income</Typography>
                        <Typography variant="h4">{totalIncome.toFixed(2)}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Card sx={{ backgroundColor: "#ffebee" }}>
                    <CardContent>
                        <Typography variant="h6">Total Expenses</Typography>
                        <Typography variant="h4">{totalExpenses.toFixed(2)}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Card sx={{ backgroundColor: "#e8f5e9" }}>
                    <CardContent>
                        <Typography variant="h6">Total Savings</Typography>
                        <Typography variant="h4">{totalSavings.toFixed(2)}</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
