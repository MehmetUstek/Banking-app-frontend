import Link from "next/link";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export default function Header() {
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
      </Toolbar>
    </AppBar>
  );
}
