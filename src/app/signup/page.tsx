"use client";

import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

export default function SignupPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [customerNumber, setCustomerNumber] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phoneNumber, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setCustomerNumber(data.customerNumber); // Store the customerNumber
        setError(""); // Clear any previous errors
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Signup failed");
      }
    } catch {
      setError("An error occurred during signup");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Signup
        </Typography>
        <form onSubmit={handleSignup}>
          <TextField
            label="Name"
            variant="outlined"
            margin="normal"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            margin="normal"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            margin="normal"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {customerNumber && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Signup successful! Your customer number is: {customerNumber}
            </Alert>
          )}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Signup
          </Button>
        </form>
      </Box>
    </Container>
  );
}
