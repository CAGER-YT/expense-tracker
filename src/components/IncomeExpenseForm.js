import React, { useState, useEffect } from "react";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import Navbar from "./Navbar";

const ExpenseIncomeForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    type: "income",
    amount: "",
    category: "", // For expense
    source: "", // For income
    description: "",
  });

  const [categories, setCategories] = useState([]); // Store categories from API

  useEffect(() => {
    if (formData.type === "expense") {
      fetchCategories();
    }
  }, [formData.type]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl =
      formData.type === "expense"
        ? "http://localhost:8080/api/expense"
        : "http://localhost:8080/api/income";

    const dataToSend =
      formData.type === "expense"
        ? { date: formData.date, amount: formData.amount, category: formData.category ,description: formData.description}
        : { date: formData.date, amount: formData.amount, source: formData.source, description: formData.description};

    try {
      const response = await axios.post(apiUrl, dataToSend);
      console.log("Success:", response.data);
      alert("Transaction added successfully!");
      setFormData({
        date: "",
        type: formData.type,
        amount: "",
        category: "",
        source: "",
        description: "",
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add transaction.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Navbar />

      <TextField
        label="Select Date"
        type="date"
        name="date"
        InputLabelProps={{ shrink: true }}
        fullWidth
        value={formData.date}
        onChange={handleChange}
        required
      />
      <br /><br />

      {/* Income/Expense Selection */}
      <FormControl>
        <FormLabel>Type</FormLabel>
        <RadioGroup row name="type" value={formData.type} onChange={handleChange}>
          <FormControlLabel value="income" control={<Radio />} label="Income" />
          <FormControlLabel value="expense" control={<Radio />} label="Expense" />
        </RadioGroup>
      </FormControl>
      <br /><br />

      {/* Common Fields */}
      <TextField
        label="Amount"
        type="number"
        name="amount"
        fullWidth
        value={formData.amount}
        onChange={handleChange}
        required
      />
      <br /><br />

      {/* Conditional Fields */}
      {formData.type === "expense" ? (
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <TextField
          label="Source"
          name="source"
          fullWidth
          value={formData.source}
          onChange={handleChange}
          required
        />
      )}
      <br /><br />

      <TextField
        label="Description (Optional)"
        name="description"
        fullWidth
        multiline
        rows={3}
        value={formData.description}
        onChange={handleChange}
      />
      <br /><br />

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Submit
      </Button>
    </form>
  );
};

export default ExpenseIncomeForm;
