import React from "react";
import { Box, TextField } from "@mui/material";

const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.875rem" } };

const BecomePartnerFormStep1 = ({ formik }) => {
  return (
    <Box className="space-y-5">
      <div>
        <p className="text-base font-semibold text-slate-900 mb-0.5">Owner Details</p>
        <p className="text-slate-500 text-sm">Tell us about the salon owner</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
          <TextField fullWidth name="fullName" placeholder="Jane Doe" value={formik.values.fullName} onChange={formik.handleChange} onBlur={formik.handleBlur} sx={fieldSx} size="small" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
          <TextField fullWidth name="email" type="email" placeholder="owner@salon.com" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} sx={fieldSx} size="small" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <TextField fullWidth name="password" type="password" placeholder="••••••••" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} sx={fieldSx} size="small" />
        </div>
      </div>
    </Box>
  );
};

export default BecomePartnerFormStep1;