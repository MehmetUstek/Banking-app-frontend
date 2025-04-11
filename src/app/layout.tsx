import React from "react";
import { CssBaseline } from "@mui/material";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Banking App</title>
      </head>
      <body>
        <CssBaseline />
        <Header />
        {children}
      </body>
    </html>
  );
}
