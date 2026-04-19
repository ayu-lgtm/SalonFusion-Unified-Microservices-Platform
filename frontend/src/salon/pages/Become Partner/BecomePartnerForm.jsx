import { Alert, Snackbar } from "@mui/material";
import React, { useState } from "react";
import SellerAccountForm from "./SalonForm";

const BecomePartner = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <div className="min-h-screen flex">
      {/* Left form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">SF</span>
            </div>
            <span className="font-semibold text-slate-800 text-lg">SalonFusion</span>
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Become a Partner</h1>
            <p className="text-slate-500 text-sm">Join thousands of salons growing with SalonFusion</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <SellerAccountForm />
          </div>
        </div>
      </div>

      {/* Right decorative panel */}
      <div className="hidden lg:flex lg:w-[42%] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute top-1/2 -left-16 w-52 h-52 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 right-10 w-80 h-80 rounded-full bg-white/5" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white text-xs font-medium">2,000+ active partners</span>
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-white text-2xl font-light leading-relaxed">
            "SalonFusion transformed how we manage bookings. Revenue up 40% in 3 months."
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">R</div>
            <div>
              <p className="text-white font-medium text-sm">Rahul Mehta</p>
              <p className="text-white/60 text-xs">Owner, Scissors & Style, Bangalore</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-3">
          {[["Zero Setup Fee", "Start for free"], ["Real-time Analytics", "Track everything"], ["24/7 Support", "Always here"], ["Smart Scheduling", "Never miss a slot"]].map(([title, sub]) => (
            <div key={title} className="bg-white/10 rounded-xl p-3">
              <p className="text-white font-semibold text-sm">{title}</p>
              <p className="text-white/60 text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled" sx={{ borderRadius: "8px" }}>
          OTP sent to your email!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BecomePartner;