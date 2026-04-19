import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-slate-200 mb-2">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
        <p className="text-slate-500 text-sm mb-8 max-w-xs">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Button
          onClick={() => navigate("/")}
          variant="contained"
          startIcon={<HomeOutlinedIcon />}
          sx={{
            borderRadius: "10px", px: 4, py: "0.75rem",
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            fontWeight: 600,
          }}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;