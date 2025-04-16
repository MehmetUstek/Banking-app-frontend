"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Loan } from "@/model/Loan";

export default function LoanPage() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [error, setError] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  // For repayment
  const [loanId, setLoanId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const fetchLoans = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/bank/loan/loans", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setLoans(data);
        const token = res.headers.get("X-CSRF-TOKEN");
        console.log("header response", token);
        setCsrfToken(token);
      } else {
        router.push("/login");

        setError("Failed to fetch loans");
      }
    } catch {
      setError("An error occurred while fetching loans");
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleCreateLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/bank/loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken ?? "",
        },
        credentials: "include",
        body: JSON.stringify({
          loanAmount: parseFloat(loanAmount),
          duration: parseInt(duration),
          bankAccountNumber,
        }),
      });
      if (res.ok) {
        // Clear form fields and refetch loans
        setLoanAmount("");
        setBankAccountNumber("");
        fetchLoans();
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Loan creation failed");
      }
    } catch {
      setError("An error occurred while creating the loan");
    }
  };

  const handleRepayLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/bank/loan/repay", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken ?? "",
        },
        credentials: "include",
        body: JSON.stringify({
          loanId: parseInt(loanId),
          paymentAmount: parseFloat(paymentAmount),
        }),
      });
      if (res.ok) {
        setLoanId("");
        setPaymentAmount("");
        fetchLoans();
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Loan repayment failed");
      }
    } catch {
      setError("An error occurred during loan repayment");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Loan Management
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {/* Create Loan Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Request a Loan</Typography>
          <form onSubmit={handleCreateLoan}>
            <TextField
              label="Loan Amount"
              variant="outlined"
              fullWidth
              required
              type="number"
              sx={{ mt: 2 }}
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
            {/* Loan Duration Dropdown */}
            <TextField
              select
              label="Loan Duration (months)"
              variant="outlined"
              fullWidth
              required
              sx={{ mt: 2 }}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Bank Account Number"
              variant="outlined"
              fullWidth
              required
              sx={{ mt: 2 }}
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Request Loan
            </Button>
          </form>
        </Box>
        {/* Repay Loan Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Repay Loan</Typography>
          <form onSubmit={handleRepayLoan}>
            <TextField
              label="Loan ID"
              variant="outlined"
              fullWidth
              required
              sx={{ mt: 2 }}
              value={loanId}
              onChange={(e) => setLoanId(e.target.value)}
            />
            <TextField
              label="Payment Amount"
              variant="outlined"
              type="number"
              fullWidth
              required
              sx={{ mt: 2 }}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Repay Loan
            </Button>
          </form>
        </Box>
        {/* Display Loans Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Your Loans</Typography>
          {loans.map((loan) => (
            <Box
              key={loan.loanId}
              sx={{ p: 2, border: "1px solid #ccc", mt: 1, borderRadius: 1 }}
            >
              <Typography>Loan ID: {loan.loanId}</Typography>
              <Typography>Loan Amount: {loan.loanAmount}</Typography>
              <Typography>Remaining Balance: {loan.remainingAmount}</Typography>
              <Typography>Interest Rate: {loan.interestRate}%</Typography>
              <Typography>Status: {loan.status ?? "ACTIVE"}</Typography>
              <Typography>
                Related Account Number: {loan.accountNumber}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
