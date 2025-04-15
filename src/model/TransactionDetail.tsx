"use client";

export interface TransactionDetail {
  id: string;
  amount: number;
  timestamp: string;
  senderAccountNumber: string;
  receiverAccountNumber: string;
}
