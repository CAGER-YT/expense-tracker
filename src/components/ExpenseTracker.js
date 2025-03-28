import { useState, useEffect } from "react";
import { Container } from "@mui/material";
import Dashboard from "./DashboardCards";
import Chart from "./ExpenseChart";
import Navbar from "./Navbar";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export default function ExpenseTracker() {
    const [income, setIncome] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchIncome();
        fetchExpenses();
        fetchCategories();
    }, []);

    const fetchIncome = async () => {
        const res = await axios.get(`${API_BASE_URL}/income`);
        setIncome(res.data);
    };
    
    const fetchExpenses = async () => {
        const res = await axios.get(`${API_BASE_URL}/expenses`);
        setExpenses(res.data);
    };
    
    const fetchCategories = async () => {
        const res = await axios.get(`${API_BASE_URL}/categories`);
        setCategories(res.data);
    };

    return (
        <Container>
            <Navbar />
            <Dashboard income={income} expenses={expenses} />
            <Chart income={income} expenses={expenses} />
        </Container>
    );
}
