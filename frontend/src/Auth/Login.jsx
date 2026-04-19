import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, TextField, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../Redux/Auth/action";

const initialValues = { email: "", password: "" };

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    dispatch(loginUser({ data: values, navigate }));
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">SF</span>
        </div>
        <span className="font-semibold text-slate-800 text-lg">SalonFusion</span>
      </div>

      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Welcome back</h1>
      <p className="text-slate-500 text-sm mb-8">Sign in to your account to continue</p>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <Field
              as={TextField}
              variant="outlined"
              fullWidth
              name="email"
              id="email"
              size="small"
              placeholder="you@example.com"
              helperText={<ErrorMessage name="email" />}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.9rem" } }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <Field
              as={TextField}
              variant="outlined"
              fullWidth
              name="password"
              type="password"
              id="password"
              size="small"
              placeholder="••••••••"
              helperText={<ErrorMessage name="password" />}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.9rem" } }}
            />
          </div>
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
            Sign in
          </Button>
        </Form>
      </Formik>

      <p className="text-center text-sm text-slate-500 mt-6">
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/register")}
          className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
        >
          Create account
        </button>
      </p>
    </div>
  );
};

export default LoginForm;