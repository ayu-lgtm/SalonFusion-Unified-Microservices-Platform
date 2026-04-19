import { Button, CircularProgress, Step, StepLabel, Stepper } from "@mui/material";
import React, { useState } from "react";
import { useFormik } from "formik";
import BecomePartnerFormStep1 from "./BecomePartnerFormStep1";
import BecomePartnerFormStep2 from "./BecomePartnerFormStep3";
import BecomePartnerFormStep3 from "./BecomePartnerFormStep2";
import { useDispatch } from "react-redux";
import { createSalon } from "../../../Redux/Salon/action";
import { useNavigate } from "react-router-dom";

const steps = ["Owner Details", "Salon Details", "Salon Address"];

const SalonForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleStep = (value) => setActiveStep(activeStep + value);

  const formik = useFormik({
    initialValues: {
      email: "", fullName: "", password: "",
      salonAddress: { phoneNumber: "", pincode: "", address: "", city: "", state: "", email: "" },
      salonDetails: { name: "", openTime: "", closeTime: "", images: [] },
    },
    onSubmit: (values) => {
      const openTime = getLocalTime(values.salonDetails.openTime);
      const closeTime = getLocalTime(values.salonDetails.closeTime);
      const ownerDetails = { fullName: values.fullName, email: values.email, password: values.password, role: "SALON_OWNER", username: values.email.split("@")[0] };
      const salonDetails = { ...values.salonDetails, openTime, closeTime, ...values.salonAddress };
      dispatch(createSalon({ ownerDetails, salonDetails, navigate }));
    },
  });

  const getLocalTime = (time) => {
    let hour = time?.$H;
    let minute = time.$m;
    let second = time.$s;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
  };

  const handleSubmit = () => formik.handleSubmit();

  return (
    <div className="w-full">
      <Stepper activeStep={activeStep} alternativeLabel sx={{
        "& .MuiStepLabel-label": { fontSize: "0.78rem", fontWeight: 500 },
        "& .MuiStepIcon-root.Mui-active": { color: "#6366f1" },
        "& .MuiStepIcon-root.Mui-completed": { color: "#10b981" },
        mb: 4,
      }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="space-y-6">
        <div className="min-h-[280px]">
          {activeStep === 0 ? (
            <BecomePartnerFormStep1 formik={formik} />
          ) : activeStep === 1 ? (
            <BecomePartnerFormStep3 formik={formik} />
          ) : (
            <BecomePartnerFormStep2 formik={formik} />
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button
            disabled={activeStep === 0}
            onClick={() => handleStep(-1)}
            variant="outlined"
            sx={{ borderRadius: "10px", borderColor: "#e2e8f0", color: "#475569", "&:hover": { borderColor: "#6366f1", color: "#6366f1" }, px: 3 }}
          >
            Back
          </Button>
          <Button
            onClick={activeStep === steps.length - 1 ? handleSubmit : () => handleStep(1)}
            variant="contained"
            sx={{ borderRadius: "10px", background: "linear-gradient(135deg,#6366f1,#4f46e5)", fontWeight: 600, px: 4, "&:hover": { background: "linear-gradient(135deg,#4f46e5,#4338ca)" } }}
          >
            {activeStep === steps.length - 1 ? (
              false ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Create Account"
            ) : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalonForm;