import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBooking, fetchBookedSlots } from "../../../../Redux/Booking/action";
import { useParams } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import ServiceCard from "./ServiceCard";
import { Alert, Button, Divider, Modal, Snackbar } from "@mui/material";
import { isServiceSelected } from "../../../../util/isServiceSelected";
import { ShoppingCartOutlined, RemoveShoppingCartOutlined, AccessTime } from "@mui/icons-material";
import SelectedServiceList from "./SelectedServiceList";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fetchServicesBySalonId } from "../../../../Redux/Salon Services/action";
import { getTodayDate } from "../../../../util/getTodayDate";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const SalonServiceDetails = () => {
  const { salon, service, category, booking } = useSelector((store) => store);
  const handleCloseSnackbar = () => setSnackbarOpen(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookingData, setBookingData] = useState({ services: [], time: null });
  const [open, setOpen] = React.useState(false);
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const handleSelectService = (service) => {
    setBookingData((prev) => ({ ...prev, services: [...prev.services, service] }));
  };
  const handleRemoveService = (id) => {
    setBookingData((prev) => ({ ...prev, services: prev.services.filter((s) => s.id !== id) }));
  };
  const handleSelectCategory = (id) => () => setSelectedCategory(id);

  const handleBooking = () => {
    const serviceIds = bookingData.services.map((s) => s.id);
    dispatch(createBooking({ bookingData: { serviceIds, startTime: bookingData.time }, salonId: id, jwt: localStorage.getItem("jwt") }));
  };

  useEffect(() => {
    dispatch(fetchBookedSlots({ salonId: id, date: bookingData.time?.split("T")[0] || getTodayDate(), jwt: localStorage.getItem("jwt") }));
  }, [id, bookingData.time]);

  useEffect(() => {
    dispatch(fetchServicesBySalonId({ salonId: id, jwt: localStorage.getItem("jwt"), categoryId: selectedCategory }));
  }, [id, selectedCategory]);

  useEffect(() => {
    if (booking.error) setSnackbarOpen(true);
  }, [booking.error]);

  const totalPrice = bookingData.services.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="lg:flex gap-6 mt-6 min-h-[75vh]">
      {/* Categories sidebar */}
      <aside className="lg:w-56 flex-shrink-0 space-y-1 border-r border-slate-100 pr-4 mb-6 lg:mb-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 px-3">Categories</p>
        <CategoryCard selectedCategory={selectedCategory} handleSelectCategory={handleSelectCategory} item={{ id: null, name: "ALL", image: "https://cdn.pixabay.com/photo/2020/05/21/11/42/hair-salon-5200393_640.jpg" }} />
        {category.categories.map((item) => (
          <CategoryCard key={item.id} selectedCategory={selectedCategory} handleSelectCategory={handleSelectCategory} item={item} />
        ))}
      </aside>

      {/* Services list */}
      <section className="flex-1 space-y-3 overflow-y-auto lg:px-4">
        {service.services.map((item) => (
          <div key={item.id} className="space-y-3">
            <ServiceCard onRemove={handleRemoveService} onSelect={handleSelectService} service={item} isSelected={isServiceSelected(bookingData.services, item.id)} />
          </div>
        ))}
      </section>

      {/* Booking panel */}
      <aside className="lg:w-64 flex-shrink-0 mt-6 lg:mt-0">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 sticky top-4 shadow-sm">
          {bookingData.services.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCartOutlined sx={{ fontSize: 18, color: "#6366f1" }} />
                <h2 className="font-semibold text-slate-800 text-sm">Selected Services</h2>
              </div>
              <SelectedServiceList handleRemoveService={handleRemoveService} services={bookingData.services} />
              <Divider sx={{ my: 1.5 }} />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500">Total</span>
                <span className="flex items-center font-bold text-slate-900 text-base">
                  <CurrencyRupeeIcon sx={{ fontSize: 14 }} />{totalPrice}
                </span>
              </div>
              <Button
                onClick={handleOpenModal}
                fullWidth
                variant="contained"
                sx={{ borderRadius: "10px", py: "0.7rem", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", fontWeight: 600 }}
              >
                Book Now
              </Button>
            </>
          ) : (
            <div className="py-6 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <RemoveShoppingCartOutlined sx={{ color: "#94a3b8", fontSize: 24 }} />
              </div>
              <p className="text-slate-500 text-sm">Add services to book an appointment</p>
            </div>
          )}
        </div>
      </aside>

      {/* Booking modal */}
      <Modal open={open} onClose={handleCloseModal}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="font-bold text-slate-900 text-lg mb-4">Confirm Your Appointment</h2>
          <div className="sm:flex gap-6">
            {/* Booked slots */}
            <div className="sm:w-[45%] mb-4 sm:mb-0">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Unavailable Slots</p>
              {booking.slots?.length > 0 ? (
                <div className="space-y-2">
                  {booking.slots.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                      <AccessTime sx={{ fontSize: 14, color: "#ef4444" }} />
                      <span className="text-xs text-red-600 font-medium">
                        {item.startTime?.split("T")[1]} – {item.endTime?.split("T")[1]}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-3 text-center">
                  <p className="text-emerald-600 text-xs font-medium">All slots available!</p>
                </div>
              )}
            </div>

            {/* Time picker + confirm */}
            <div className="flex-1 space-y-4">
              <SelectedServiceList handleRemoveService={handleRemoveService} services={bookingData.services} />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  sx={{ width: "100%", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  onChange={(value) => {
                    if (value) {
                      const localDate = value.format("YYYY-MM-DDTHH:mm:ss");
                      setBookingData((prev) => ({ ...prev, time: localDate }));
                    }
                  }}
                  label="Select date & time"
                />
              </LocalizationProvider>
              <Button
                onClick={handleBooking}
                fullWidth
                variant="contained"
                sx={{ borderRadius: "10px", py: "0.75rem", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", fontWeight: 600 }}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled" sx={{ borderRadius: "8px" }}>
          {booking.error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SalonServiceDetails;