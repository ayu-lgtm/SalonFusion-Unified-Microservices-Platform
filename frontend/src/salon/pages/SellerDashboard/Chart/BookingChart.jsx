import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../../../../Redux/Chart/action";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CircularProgress } from "@mui/material";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2 text-sm">
        <p className="text-slate-500 text-xs mb-1">{label}</p>
        <p className="font-bold text-emerald-600">{payload[0].value} bookings</p>
      </div>
    );
  }
  return null;
};

const BookingCharts = () => {
  const dispatch = useDispatch();
  const { chart } = useSelector((store) => store);

  useEffect(() => {
    dispatch(fetchBookings(localStorage.getItem("jwt")));
  }, []);

  if (chart.earnings.loading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <CircularProgress sx={{ color: "#10b981" }} size={32} />
      </div>
    );
  }

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chart.bookings?.data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="daily" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={35} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#d1fae5", strokeWidth: 2 }} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingCharts;