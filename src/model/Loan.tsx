"use client";
export interface Loan {
  loanId: number;
  loanAmount: number;
  remainingAmount: number;
  interestRate: number;
  startDate: string;
  endDate: string;
  status: string;
  accountNumber: string;
}
