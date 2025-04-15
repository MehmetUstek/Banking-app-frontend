import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function TransactionHistoryPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentAccountNumber = router.query.accountNumber; // Assuming account number is passed as a query parameter

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!currentAccountNumber) return;
      try {
        const res = await fetch(
          `http://localhost:8080/api/bank/transaction/transaction_history?bankAccountNumber=${currentAccountNumber}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        } else {
          const errData = await res.json();
          setError(errData.message || "Failed to fetch transaction history");
        }
      } catch (err) {
        setError("An error occurred while fetching transaction history");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, [currentAccountNumber]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Transaction History
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <List>
          {transactions.map((transaction) => (
            <ListItem
              button
              key={transaction.transactionId}
              onClick={() => router.push(`/transaction-details/${transaction.transactionId}`)}
            >
              <ListItemText
                primary={`Amount: ${transaction.amount}`}
                secondary={`Date: ${new Date(transaction.date).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}