import React, { useState } from "react";
import { Alert, Box, Button, Divider, Modal, Snackbar } from "@mui/material";
import ProfileFildCard from "./ProfileFildCard";
import { useSelector } from "react-redux";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";

export const style = {
  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
  width: "min(440px,95vw)", bgcolor: "background.paper", borderRadius: "16px", boxShadow: "0 25px 50px rgba(0,0,0,0.15)", p: 4,
};

const Profile = () => {
  const { salon, auth } = useSelector((store) => store);
  const [open, setOpen] = React.useState(false);
  const [selectedForm, setSelectedForm] = useState("personalDetails");
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = (formName) => { setOpen(true); setSelectedForm(formName); };

  const renderSelectedForm = () => {
    switch (selectedForm) {
      default: return null;
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Account</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your salon profile and settings</p>
      </div>

      {/* Salon images */}
      {salon.salon?.images?.length > 0 && (
        <div className="grid grid-cols-3 gap-3 h-52 rounded-2xl overflow-hidden">
          <div className="col-span-1 overflow-hidden rounded-l-2xl">
            <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src={salon.salon?.images[0]} alt="" />
          </div>
          <div className="col-span-1 overflow-hidden">
            <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src={salon.salon?.images[1]} alt="" />
          </div>
          <div className="col-span-1 overflow-hidden rounded-r-2xl">
            <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src={salon.salon?.images[2]} alt="" />
          </div>
        </div>
      )}

      {/* Owner Details */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <PersonOutlineIcon sx={{ fontSize: 18, color: "#6366f1" }} />
          </div>
          <h2 className="font-semibold text-slate-900">Owner Details</h2>
        </div>
        <ProfileFildCard keys="Owner Name" value={auth.user?.fullName} />
        <ProfileFildCard keys="Owner Email" value={auth.user?.email} />
        <ProfileFildCard keys="Role" value="Salon Owner" />
      </div>

      {/* Salon Details */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <StoreOutlinedIcon sx={{ fontSize: 18, color: "#10b981" }} />
          </div>
          <h2 className="font-semibold text-slate-900">Salon Details</h2>
        </div>
        <ProfileFildCard keys="Salon Name" value={salon.salon?.name} />
        <ProfileFildCard keys="Address" value={salon.salon?.address || "Not provided"} />
        <ProfileFildCard keys="Open Time" value={salon.salon?.openTime} />
        <ProfileFildCard keys="Close Time" value={salon.salon?.closeTime} />
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>{renderSelectedForm()}</Box>
      </Modal>

      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={salon.error ? "error" : "success"} variant="filled" sx={{ borderRadius: "8px" }} onClose={() => setOpenSnackbar(false)}>
          {salon.error ? salon.error : "Profile Updated Successfully"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;