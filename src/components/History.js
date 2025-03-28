import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { jsPDF } from "jspdf";
import Navbar from "./Navbar";
import "jspdf-autotable";

const History = () => {
  const [dataType, setDataType] = useState("income"); // Default: Income
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Category filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchData();
    if (dataType === "expenses") {
      fetchCategories();
    }
  }, [dataType, startDate, endDate, selectedCategory]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/${dataType}`);
      let filteredData = response.data;

      if (startDate && endDate) {
        filteredData = filteredData.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });
      }

      if (dataType === "expenses" && selectedCategory) {
        filteredData = filteredData.filter((item) => item.category === selectedCategory);
      }

      setData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ✅ EXPORT TO CSV
  const exportToCSV = () => {
    const csvHeaders = ["Date", dataType === "income" ? "Source" : "Category", "Amount", "Description"];
    const csvRows = data.map((item) => [
      item.date,
      dataType === "income" ? item.source : item.category,
      item.amount,
      item.description,
    ]);

    const csvContent = [
      csvHeaders.join(","), 
      ...csvRows.map((row) => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${dataType}-history.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ EXPORT TO PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Transaction History (${dataType.toUpperCase()})`, 14, 10);

    const tableColumn = ["Date", dataType === "income" ? "Source" : "Category", "Amount", "Description"];
    const tableRows = data.map((item) => [
      item.date,
      dataType === "income" ? item.source : item.category,
      item.amount,
      item.description,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`${dataType}-history.pdf`);
  };

  // ✅ CALCULATE TOTAL AMOUNT
  const totalAmount = data.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Navbar />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Transaction History
        </Typography>

        {/* Radio Buttons for Toggle */}
        <RadioGroup row value={dataType} onChange={(e) => setDataType(e.target.value)}>
          <FormControlLabel value="income" control={<Radio />} label="Income" />
          <FormControlLabel value="expenses" control={<Radio />} label="Expenses" />
        </RadioGroup>

        {/* Filters */}
        <Box display="flex" gap={2} mt={2}>
          <TextField
            type="date"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
          />
          <TextField
            type="date"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={fetchData} sx={{ minWidth: "150px" }}>
            Apply Filter
          </Button>
        </Box>

        {/* Category Filter (Only for Expenses) */}
        {dataType === "expenses" && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Export Buttons */}
        <Box mt={2} display="flex" gap={2}>
          <Button variant="outlined" onClick={exportToCSV}>
            Export CSV
          </Button>
          <Button variant="outlined" onClick={exportToPDF}>
            Export PDF
          </Button>
        </Box>
      </Paper>

      {/* Data Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>{dataType === "income" ? "Source" : "Category"}</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{dataType === "income" ? item.source : item.category}</TableCell>
                  <TableCell>₹{item.amount}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
            {/* Footer Row for Total Amount */}
            <TableRow>
              <TableCell colSpan={2}><strong>Total</strong></TableCell>
              <TableCell><strong>₹{totalAmount.toFixed(2)}</strong></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default History;
