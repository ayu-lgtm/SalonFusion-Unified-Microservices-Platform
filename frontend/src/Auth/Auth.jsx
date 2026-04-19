import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import RegistrationForm from "./Register";
import LoginForm from "./Login";

const Auth = ({ open, handleClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  useEffect(() => {
    if (auth.success || auth.error) setOpenSnackBar(true);
  }, [auth.success, auth.error]);

  const handleCloseSnackBar = () => setOpenSnackBar(false);

  const isRegister = location.pathname === "/register";

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5"></div>
          <div className="absolute top-1/2 -left-20 w-60 h-60 rounded-full bg-white/5"></div>
          <div className="absolute -bottom-20 right-20 w-96 h-96 rounded-full bg-white/5"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold">SF</span>
            </div>
            <span className="text-white font-semibold text-xl">SalonFusion</span>
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <blockquote className="text-white/90 text-2xl font-light leading-relaxed">
            "The most elegant platform for managing salon operations and delighting clients."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">P</div>
            <div>
              <p className="text-white font-medium text-sm">Priya Sharma</p>
              <p className="text-white/60 text-xs">Owner, Glow Studio Mumbai</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex gap-4">
          {["50K+", "2K+", "98%"].map((stat, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4 flex-1 text-center">
              <p className="text-white font-bold text-xl">{stat}</p>
              <p className="text-white/60 text-xs mt-1">{["Bookings", "Salons", "Uptime"][i]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        {isRegister ? <RegistrationForm /> : <LoginForm />}
      </div>

      <Snackbar
        sx={{ zIndex: 50 }}
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={auth.error ? "error" : "success"}
          sx={{ width: "100%", borderRadius: "8px" }}
        >
          {auth.success || auth.error?.response?.data?.message || auth.error?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Auth;