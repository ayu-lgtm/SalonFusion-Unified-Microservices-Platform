import React, { useEffect } from "react";
import ReportCard from "./Report/ReportCard";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import RefundOutlinedIcon from "@mui/icons-material/MoneyOffOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EarningCharts from "./Chart/EarningCharts";
import BookingCharts from "./Chart/BookingChart";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { booking } = useSelector((store) => store);

  const reportCards = [
    { icon: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 20 }} />, value: `₹${booking.report?.totalEarnings ?? 0}`, title: "Total Earnings" },
    { icon: <BookmarkBorderIcon sx={{ fontSize: 20 }} />, value: booking.report?.totalBookings ?? 0, title: "Total Bookings" },
    { icon: <RefundOutlinedIcon sx={{ fontSize: 20 }} />, value: `₹${booking.report?.totalRefund ?? 0}`, title: "Total Refund" },
    { icon: <CancelOutlinedIcon sx={{ fontSize: 20 }} />, value: booking.report?.cancelledBookings ?? 0, title: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Welcome back — here's what's happening today</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {reportCards.map((card) => (
          <ReportCard key={card.title} icon={card.icon} value={card.value} title={card.title} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Revenue Overview</h2>
              <p className="text-slate-400 text-xs mt-0.5">Earnings trend over time</p>
            </div>
            <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg font-medium">Monthly</span>
          </div>
          <EarningCharts />
        </div>

        {/* Booking chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900 text-base">Bookings</h2>
            <p className="text-slate-400 text-xs mt-0.5">Booking trend over time</p>
          </div>
          <BookingCharts />
        </div>
      </div>
    </div>
  );
};

export default HomePage;