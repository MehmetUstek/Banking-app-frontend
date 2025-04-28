"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Typography, Box, Alert, Button } from "@mui/material";
import { TransactionDetail } from "@/model/TransactionDetail";

function TransactionDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionDetail | null>(null);
  const [error, setError] = useState("");
  const transactionId = searchParams.get("transactionId");

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetails(transactionId);
    }
  }, [transactionId]);

  const fetchTransactionDetails = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/bank/transaction/transaction_detail?transactionId=${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
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

  if (!transactionId) {
    return <Typography variant="body1">Transaction ID not found.</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Transaction Details
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {transactionDetails ? (
          <Box>
            <Typography variant="h6">
              Transaction ID: {transactionDetails.id}
            </Typography>
            <Typography variant="body1">
              Amount: {transactionDetails.amount}
            </Typography>
            <Typography variant="body1">
              Date: {transactionDetails.timestamp}
            </Typography>
            <Typography variant="body1">
              Sender Account: {transactionDetails.senderAccountNumber}
            </Typography>
            <Typography variant="body1">
              Receiver Account: {transactionDetails.receiverAccountNumber}
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.back()}
              sx={{ mt: 2 }}
            >
              Back to History
            </Button>
          </Box>
        ) : (
          <Typography variant="body1">
            Loading transaction details...
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default function TransactionDetailsPage() {
  return (
    <Suspense
      fallback={
        <Container>
          <Typography>Loading...</Typography>
        </Container>
      }
    >
      <TransactionDetailsContent />
    </Suspense>
  );
}
