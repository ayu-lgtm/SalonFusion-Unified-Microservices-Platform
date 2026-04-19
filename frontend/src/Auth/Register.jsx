import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, TextField, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../Redux/Auth/action";

const initialValues = { fullName: "", email: "", password: "", role: "CUSTOMER" };

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: Yup.string().required("Type is required"),
});

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    values.username = values.email.split("@")[0];
    dispatch(registerUser({ userData: values, navigate }));
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">SF</span>
        </div>
        <span className="font-semibold text-slate-800 text-lg">SalonFusion</span>
      </div>

      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Create your account</h1>
      <p className="text-slate-500 text-sm mb-8">Join thousands of salon professionals</p>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form className="space-y-4">
          {[
            { name: "fullName", label: "Full name", placeholder: "Jane Doe", type: "text" },
            { name: "email", label: "Email address", placeholder: "you@example.com", type: "email" },
            { name: "password", label: "Password", placeholder: "••••••••", type: "password" },
          ].map(({ name, label, placeholder, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
              <Field
                as={TextField}
                variant="outlined"
                fullWidth
                name={name}
                type={type}
                size="small"
                placeholder={placeholder}
                helperText={<ErrorMessage name={name} />}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.9rem" } }}
              />
            </div>
          ))}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 1, py: "0.75rem",
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 600,
              "&:hover": { background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)" },
            }}
          >
            Create account
          </Button>
        </Form>
      </Formik>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default RegistrationForm;