import { createTheme } from "@mui/material";

const greenTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1",
      dark: "#4f46e5",
      light: "#e0e7ff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#10b981",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
    divider: "#e2e8f0",
    success: { main: "#10b981" },
    error: { main: "#ef4444" },
    warning: { main: "#f59e0b" },
    info: { main: "#3b82f6" },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    button: { textTransform: "none", fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        contained: {
          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
          "&:hover": { background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
          },
        },
      },
    },
    MuiCard: { styleOverrides: { root: { borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)" } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 6 } } },
    MuiTableCell: { styleOverrides: { head: { background: "#f1f5f9", fontWeight: 600, color: "#475569", fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase" } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiDivider: { styleOverrides: { root: { borderColor: "#e2e8f0" } } },
  },
});

export default greenTheme;