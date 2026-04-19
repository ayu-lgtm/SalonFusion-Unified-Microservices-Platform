import { Button, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { paymentScuccess } from "../../../Redux/Payment/action";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const PaymentSuccessHandler = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { booking } = useSelector((store) => store);
  const navigate = useNavigate();

  const getQueryParam = (key) => {
    const params = new URLSearchParams(location.search);
    return params.get(key);
  };

  const paymentId = getQueryParam("razorpay_payment_id");
  const paymentLinkId = getQueryParam("razorpay_payment_link_id");

  useEffect(() => {
    if (paymentId) {
      dispatch(paymentScuccess({ paymentId, paymentLinkId: paymentLinkId || "", jwt: localStorage.getItem("jwt") || "" }));
    }
  }, [paymentId]);

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      {true ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-10 w-full max-w-md text-center shadow-xl shadow-slate-100">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-6">
            <CheckCircleOutlineIcon sx={{ fontSize: 44, color: "#10b981" }} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Your appointment has been successfully booked. We'll send you a confirmation shortly.
          </p>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-8">
            <p className="text-emerald-700 text-sm font-medium">Payment ID: <span className="font-mono text-xs">{paymentId?.slice(0, 20)}...</span></p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/bookings")}
              variant="outlined"
              fullWidth
              startIcon={<BookmarkBorderIcon />}
              sx={{ borderRadius: "12px", py: "0.75rem", borderColor: "#e2e8f0", color: "#475569", "&:hover": { borderColor: "#6366f1", color: "#6366f1", background: "#eef2ff" } }}
            >
              My Bookings
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              fullWidth
              startIcon={<HomeOutlinedIcon />}
              sx={{ borderRadius: "12px", py: "0.75rem", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", fontWeight: 600 }}
            >
              Go Home
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <CircularProgress sx={{ color: "#6366f1" }} />
          <p className="text-slate-500 text-sm">Processing your payment...</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessHandler;