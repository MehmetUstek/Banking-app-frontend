// filepath: /Users/mehmetustek/localDocs/Banking Application/banking-app-frontend/src/app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
} from "@mui/material";

interface Account {
  accountNumber: string;
  balance: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0.0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAccounts();
    fetchTotalBalance();
  }, [router]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/bank/show_accounts", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setAccounts(data);
      } else {
        handleFetchError(res);
      }
    } catch (err) {
      console.error("Failed to fetch accounts", err);
    }
  };

  const fetchTotalBalance = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/api/bank/account/view_total_balance",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setTotalBalance(data);
      } else {
        handleFetchError(res);
      }
    } catch (err) {
      console.error("Failed to fetch total balance", err);
    }
  };

  const handleFetchError = (res: Response) => {
    if (res.status === 401 || res.status === 403) {
      document.cookie =
        "JWT_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/login");
    } else {
      setError("An error occurred while fetching data");
    }
  };

  const handleAccountClick = (accountNumber: string) => {
    router.push(`/transaction-history?accountNumber=${accountNumber}`);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Typography variant="h5">Total Balance: {totalBalance.toFixed(2)}</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
          {accounts.map((account) => (
            <Button
              key={account.accountNumber}
              variant="outlined"
              onClick={() => handleAccountClick(account.accountNumber)}
              sx={{ mb: 2 }}
            >
              Account Number: {account.accountNumber} - Balance: {account.balance}
            </Button>
          ))}
        </Box>
      </Box>
    </Container>
  );
}