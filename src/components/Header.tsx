"use client";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Banking App
        </Typography>
        <Button color="inherit" component={Link} href="/">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} href="/loan">
          Loan Management
        </Button>
        <Button color="inherit" component={Link} href="/login">
          Login
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
