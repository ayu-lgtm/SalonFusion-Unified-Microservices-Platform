import React, { useEffect } from "react";
import BookingCard from "./BookingCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerBookings } from "../../../Redux/Booking/action";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const Bookings = () => {
  const dispatch = useDispatch();
  const { booking } = useSelector((store) => store);

  useEffect(() => {
    dispatch(fetchCustomerBookings(localStorage.getItem("jwt")));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <BookmarkBorderIcon sx={{ color: "#6366f1", fontSize: 20 }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-slate-500 text-sm">{booking.bookings.length} appointment{booking.bookings.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {booking.bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <BookmarkBorderIcon sx={{ color: "#94a3b8", fontSize: 32 }} />
          </div>
          <h3 className="font-semibold text-slate-700 mb-1">No bookings yet</h3>
          <p className="text-slate-400 text-sm">Your upcoming appointments will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {booking.bookings.map((item) => (
            <BookingCard key={item.id} booking={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;