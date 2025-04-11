"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [customerNumber, setCustomerNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Remove existing JWT_TOKEN cookie
    document.cookie =
      "JWT_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure cookies are sent/received
        body: JSON.stringify({ customerNumber, password }),
      });
      if (res.ok) {
        router.push("/");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Login failed");
      }
    } catch {
      setError("An error occurred during login");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Customer Number"
            variant="outlined"
            margin="normal"
            fullWidth
            value={customerNumber}
            onChange={(e) => setCustomerNumber(e.target.value)}
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
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Login
          </Button>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Don&apos;t have an account?{" "}
          </Typography>
          <Button color="inherit" component={Link} href="/signup">
            Signup
          </Button>
        </form>
      </Box>
    </Container>
  );
}
