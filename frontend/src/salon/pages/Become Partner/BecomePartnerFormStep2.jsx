import React, { useState } from "react";
import { Box, CircularProgress, IconButton, Stack, TextField } from "@mui/material";
import { LocalizationProvider, MobileTimePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { AddPhotoAlternate, Close } from "@mui/icons-material";

const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.875rem" } };

const BecomePartnerFormStep3 = ({ formik }) => {
  const [uploadImage, setUploadingImage] = useState(false);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    formik.setFieldValue("salonDetails.images", [...formik.values.salonDetails.images, image]);
    setUploadingImage(false);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.salonDetails.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("salonDetails.images", updatedImages);
  };

  return (
    <Box className="space-y-5">
      <div>
        <p className="text-base font-semibold text-slate-900 mb-0.5">Salon Details</p>
        <p className="text-slate-500 text-sm">Add your salon information and photos</p>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Salon Photos</label>
        <div className="flex flex-wrap gap-3">
          <div className="relative w-20 h-20">
            <input type="file" accept="image/*" id="salonImageInput" style={{ display: "none" }} onChange={handleImageChange} />
            <label htmlFor="salonImageInput" className="w-20 h-20 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
              <AddPhotoAlternate sx={{ color: "#94a3b8", fontSize: 22 }} />
              <span className="text-xs text-slate-400 mt-0.5">Add</span>
            </label>
            {uploadImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                <CircularProgress size={20} sx={{ color: "#6366f1" }} />
              </div>
            )}
          </div>
          {formik.values.salonDetails.images.map((image, index) => (
            <div key={index} className="relative w-20 h-20">
              <img className="w-20 h-20 object-cover rounded-xl" src={image} alt="" />
              <IconButton onClick={() => handleRemoveImage(index)} size="small" sx={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "white", width: 20, height: 20, "&:hover": { background: "#dc2626" } }}>
                <Close sx={{ fontSize: "11px" }} />
              </IconButton>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Salon Name</label>
        <TextField fullWidth name="salonDetails.name" placeholder="e.g. Glow Studio" value={formik.values.salonDetails.name} onChange={formik.handleChange} onBlur={formik.handleBlur} sx={fieldSx} size="small" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Opening Time</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              onChange={(newValue) => { if (newValue) formik.setFieldValue("salonDetails.openTime", newValue); }}
              slotProps={{ textField: { size: "small", sx: fieldSx, fullWidth: true } }}
            />
          </LocalizationProvider>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Closing Time</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
              onChange={(newValue) => { if (newValue) formik.setFieldValue("salonDetails.closeTime", newValue); }}
              slotProps={{ textField: { size: "small", sx: fieldSx, fullWidth: true } }}
            />
          </LocalizationProvider>
        </div>
      </div>
    </Box>
  );
};

export default BecomePartnerFormStep3;