import React from "react";
import { Grid2, TextField } from "@mui/material";

const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.875rem" } };

const BecomePartnerFormStep2 = ({ formik }) => {
  return (
    <div className="space-y-1">
      <div className="mb-4">
        <p className="text-base font-semibold text-slate-900 mb-0.5">Salon Address</p>
        <p className="text-slate-500 text-sm">Where is your salon located?</p>
      </div>
      <Grid2 container spacing={2.5}>
        <Grid2 size={6}>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile</label>
          <TextField fullWidth name="salonAddress.phoneNumber" placeholder="9876543210" value={formik.values?.salonAddress.phoneNumber} onChange={formik.handleChange} onBlur={formik.handleBlur} sx={fieldSx} size="small" />
        </Grid2>
        <Grid2 size={6}>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Pincode</label>
          <TextField fullWidth name="salonAddress.pincode" placeholder="400001" value={formik.values?.salonAddress.pincode} onChange={formik.handleChange} onBlur={formik.handleBlur} sx={fieldSx} size="small" />
        </Grid2>
        <Grid2 size={12}>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
          <TextField fullWidth name="salonAddress.address" placeholder="House No., Building, Street" value={formik.values?.salonAddress.address} onChange={formik.handleChange} onBlur={formik.handleBlur} sx={fieldSx} size="small" />
        </Grid2>
        <Grid2 size={12}>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
          <TextField fullWidth name="salonAddress.city" placeholder="Mumbai" value={formik.values?.salonAddress.city} onChange={formik.handleChange} onBlur={formik.handleBlur} sx={fieldSx} size="small" />
        </Grid2>
        <Grid2 size={12}>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Email</label>
          <TextField fullWidth name="salonAddress.email" placeholder="salon@business.com" value={formik.values?.salonAddress.email} onChange={formik.handleChange} onBlur={formik.handleBlur} sx={fieldSx} size="small" />
        </Grid2>
      </Grid2>
    </div>
  );
};

export default BecomePartnerFormStep2;