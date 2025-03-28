import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Expense Tracker
                </Typography>
                <Button color="inherit" component={Link} to="/">Dashboard</Button>
                <Button color="inherit" component={Link} to="/history">History</Button>
                <Button color="inherit" component={Link} to="/add">Add Income/Expense</Button>
            </Toolbar>
        </AppBar>
    );
}
