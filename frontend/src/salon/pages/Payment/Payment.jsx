import { Button, Divider } from "@mui/material";
import React, { useState } from "react";
import TransactionTable from "./TransactionTable";
import Payouts from "./PayoutsTable";
import { useSelector } from "react-redux";
import { getPriceTotal } from "../../../util/totalEarning";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const tab = [{ name: "Transaction" }];

const Payment = () => {
  const [activeTab, setActiveTab] = useState(tab[0].name);
  const { booking } = useSelector((store) => store);
  const totalEarning = getPriceTotal(booking.bookings);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Payments</h1>
        <p className="text-slate-500 text-sm mt-0.5">Track your earnings and transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-3 -left-3 w-16 h-16 rounded-full bg-white/10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Total Earnings</p>
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 16 }} />
              </div>
            </div>
            <div className="flex items-center">
              <CurrencyRupeeIcon sx={{ fontSize: 20 }} />
              <span className="text-3xl font-bold">{totalEarning}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Transactions</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ReceiptLongOutlinedIcon sx={{ fontSize: 16, color: "#10b981" }} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{booking.bookings.length}</p>
          <p className="text-slate-400 text-xs mt-1">Total bookings</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Last Payment</p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <TrendingUpIcon sx={{ fontSize: 16, color: "#f59e0b" }} />
            </div>
          </div>
          <div className="flex items-center text-2xl font-bold text-slate-900">
            <CurrencyRupeeIcon sx={{ fontSize: 18 }} />0
          </div>
          <p className="text-slate-400 text-xs mt-1">Most recent</p>
        </div>
      </div>

      {/* Tab + Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          {tab.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.name ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ReceiptLongOutlinedIcon sx={{ fontSize: 15 }} /> {item.name}
            </button>
          ))}
        </div>

        {activeTab === "Transaction" ? <TransactionTable /> : <Payouts />}
      </div>
    </div>
  );
};

export default Payment;