"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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

  // Form state for transactions
  const [transactionType, setTransactionType] = useState<
    "deposit" | "withdraw"
  >("deposit");
  const [depositAmount, setDepositAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [senderAccount, setSenderAccount] = useState("");
  const [receiverAccount, setReceiverAccount] = useState("");
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  // On component mount, fetch accounts and total balance.
  useEffect(() => {
    // Clear the X-XSRF-TOKEN cookie on page load
    document.cookie =
      "XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    fetchAccounts();
    fetchTotalBalance();
  }, [router]);

  const handleAccountClick = (accountNumber: string) => {
    router.push(`/transaction-history?accountNumber=${accountNumber}`);
  };

  const fetchAccounts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/bank/show_accounts", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setAccounts(data);
        const token = res.headers.get("X-CSRF-TOKEN");
        console.log("header response", token);
        setCsrfToken(token);
        // if (token) {
        //   sessionStorage.setItem("X-XSRF-TOKEN", token);
        // }
      } else if (res.status === 401 || res.status === 403) {
        document.cookie =
          "JWT_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/login");
      }
    } catch (err) {
      router.push("/login");
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
      } else if (res.status === 401 || res.status === 403) {
        document.cookie =
          "JWT_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to fetch total balance", err);
    }
  };

  const handleDepositWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accounts.length === 0) return;
    const endpoint =
      transactionType === "deposit"
        ? "http://localhost:8080/api/bank/account/deposit"
        : "http://localhost:8080/api/bank/account/withdraw";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken ?? "",
        },
        credentials: "include",
        body: JSON.stringify({
          accountNumber: accounts[0].accountNumber,
          amount: parseFloat(depositAmount),
        }),
      });
      if (res.ok) {
        fetchAccounts();
        fetchTotalBalance();
      } else {
        const errData = await res.json();
        setError(errData.message || "Transaction failed");
      }
    } catch {
      setError("An error occurred during the transaction");
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accounts.length === 0) return;
    try {
      const res = await fetch(
        "http://localhost:8080/api/bank/transaction/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken ?? "",
          },
          credentials: "include",
          body: JSON.stringify({
            senderAccountNumber: senderAccount,
            receiverAccountNumber: receiverAccount,
            amount: parseFloat(transferAmount),
          }),
        }
      );
      if (res.ok) {
        fetchAccounts();
        fetchTotalBalance();
      } else {
        const errData = await res.json();
        setError(errData.message || "Transfer failed");
      }
    } catch {
      setError("An error occurred while transferring funds");
    }
  };

  const handleCreateAccount = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/bank/account/create", {
        method: "POST",
        headers: {
          "X-XSRF-TOKEN": csrfToken ?? "",
        },
        credentials: "include",
      });
      if (res.ok) {
        fetchAccounts();
        fetchTotalBalance();
      } else {
        const errData = await res.json();
        setError(errData.message || "Account creation failed");
      }
    } catch {
      setError("An error occurred while creating the account");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Button
          variant="contained"
          onClick={handleCreateAccount}
          sx={{ mt: 2 }}
        >
          Create New Account
        </Button>
        {/* Deposit/Withdraw Section */}
        <br />
        <br />
        <br />
        <Typography variant="subtitle2">
          Warning: Withdraw/deposit functionaly is left open for test purposes
          only.
          <br></br>
          Normally a user cannot deposit money into an account without actually
          sending a money from another bank or using an ATM.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Deposit / Withdraw</Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="transaction-type-label">
              Transaction Type
            </InputLabel>
            <Select
              labelId="transaction-type-label"
              value={transactionType}
              label="Transaction Type"
              onChange={(e) =>
                setTransactionType(e.target.value as "deposit" | "withdraw")
              }
            >
              <MenuItem value="deposit">Deposit</MenuItem>
              <MenuItem value="withdraw">Withdraw</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Amount"
            variant="outlined"
            fullWidth
            type="number"
            sx={{ mt: 2 }}
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleDepositWithdraw}
          >
            {transactionType === "deposit" ? "Deposit" : "Withdraw"}
          </Button>
        </Box>
        {/* Transfer Money Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Transfer Money</Typography>
          <TextField
            label="Sender Account Number"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            value={senderAccount}
            onChange={(e) => setSenderAccount(e.target.value)}
          />
          <TextField
            label="Receiver Account Number"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            value={receiverAccount}
            onChange={(e) => setReceiverAccount(e.target.value)}
          />

          <TextField
            label="Amount"
            variant="outlined"
            fullWidth
            type="number"
            sx={{ mt: 2 }}
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleTransfer}>
            Transfer
          </Button>
        </Box>
        {/* Accounts Display Section */}
        <Box sx={{ mt: 4, mb: 10 }}>
          <Typography variant="h5">
            Total Balance: {totalBalance.toFixed(2)}
          </Typography>
          <Box sx={{ display: "flex", overflowX: "auto", gap: 2, mt: 2 }}>
            {accounts.map((account) => (
              <Box
                key={account.accountNumber}
                sx={{
                  flex: "0 0 auto",
                  p: 2,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                }}
              >
                <Typography>Account Number: {account.accountNumber}</Typography>
                <Typography>Balance: {account.balance}</Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => handleAccountClick(account.accountNumber)}
                >
                  View Transaction History
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
