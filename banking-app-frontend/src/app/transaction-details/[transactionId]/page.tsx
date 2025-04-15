import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Box, Alert, Button } from "@mui/material";

export default function TransactionDetailsPage() {
  const router = useRouter();
  const { transactionId } = router.query;
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetails(transactionId);
    }
  }, [transactionId]);

  const fetchTransactionDetails = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/bank/transaction/transaction_detail?transactionId=${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setTransactionDetails(data);
      } else {
        const errData = await res.json();
        setError(errData.message || "Failed to fetch transaction details");
      }
    } catch {
      setError("An error occurred while fetching transaction details");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Transaction Details
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {transactionDetails ? (
          <Box>
            <Typography variant="h6">Transaction ID: {transactionDetails.id}</Typography>
            <Typography variant="body1">Amount: {transactionDetails.amount}</Typography>
            <Typography variant="body1">Date: {transactionDetails.date}</Typography>
            <Typography variant="body1">Sender Account: {transactionDetails.senderAccount}</Typography>
            <Typography variant="body1">Receiver Account: {transactionDetails.receiverAccount}</Typography>
            <Button variant="contained" onClick={() => router.back()} sx={{ mt: 2 }}>
              Back to History
            </Button>
          </Box>
        ) : (
          <Typography variant="body1">Loading transaction details...</Typography>
        )}
      </Box>
    </Container>
  );
}