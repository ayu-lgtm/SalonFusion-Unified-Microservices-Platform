import React from "react";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateBookingStatus } from "../../../Redux/Booking/action";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const statusConfig = {
  CONFIRMED: { icon: <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />, class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  PENDING: { icon: <ScheduleIcon sx={{ fontSize: 14 }} />, class: "bg-blue-50 text-blue-700 border-blue-200" },
  CANCELLED: { icon: <CancelOutlinedIcon sx={{ fontSize: 14 }} />, class: "bg-red-50 text-red-700 border-red-200" },
};

const BookingCard = ({ booking }) => {
  const dispatch = useDispatch();

  const handleCancelBooking = () => {
    dispatch(updateBookingStatus({ bookingId: booking.id, status: "CANCELLED", jwt: localStorage.getItem("jwt") }));
  };

  const statusCfg = statusConfig[booking.status] || statusConfig.PENDING;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-slate-200 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-slate-900 text-lg">{booking.salon.name}</h1>
            <span className={`inline-flex items-center gap-1 text-xs font-medium border px-2 py-0.5 rounded-full ${statusCfg.class}`}>
              {statusCfg.icon} {booking.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {booking.services.map((service) => (
              <span key={service.id} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-lg font-medium">
                {service.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
              {booking.startTime?.split("T")[0]}
            </div>
            <div className="flex items-center gap-1.5">
              <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />
              {booking.startTime?.split("T")[1]} – {booking.endTime?.split("T")[1]}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <img className="h-20 w-20 rounded-xl object-cover" src={booking.salon.images[0]} alt="" />
          <div className="flex items-center font-bold text-slate-900">
            <CurrencyRupeeIcon sx={{ fontSize: 14 }} />{booking.totalPrice}
          </div>
          <Button
            onClick={handleCancelBooking}
            color="error"
            size="small"
            disabled={booking.status === "CANCELLED"}
            variant={booking.status === "CANCELLED" ? "contained" : "outlined"}
            sx={{ borderRadius: "8px", fontSize: "0.75rem", minWidth: "80px" }}
          >
            {booking.status === "CANCELLED" ? "Cancelled" : "Cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;