import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExpenseTracker from "./components/ExpenseTracker";
import History from "./components/History";
import Add from "./components/IncomeExpenseForm";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ExpenseTracker />} />
                <Route path="/history" element={<History />} />
                <Route path="/add" element={<Add />} />
            </Routes>
        </Router>
    );
}
