import React, { useState } from "react";
import { useFormik } from "formik";
import {
  TextField, Button, CircularProgress, IconButton, Snackbar, Alert, Grid2,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { useDispatch } from "react-redux";
import { createCategory } from "../../../Redux/Category/action";

const CategoryForm = () => {
  const [uploadImage, setUploadingImage] = useState(false);
  const [snackbarOpen, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { name: "", image: "" },
    onSubmit: (values) => {
      dispatch(createCategory({ category: values, jwt: localStorage.getItem("jwt") }));
    },
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    formik.setFieldValue("image", image);
    setUploadingImage(false);
  };

  const handleRemoveImage = () => formik.setFieldValue("image", "");

  const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.875rem" } };

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Create Category</h1>
        <p className="text-slate-500 text-sm mt-0.5">Add a new service category to your salon</p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12 }}>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category Image</label>
            {formik.values.image ? (
              <div className="relative w-28 h-28">
                <img className="w-28 h-28 object-cover rounded-xl border border-slate-200" src={formik.values.image} alt="" />
                <IconButton onClick={handleRemoveImage} size="small" sx={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "white", width: 22, height: 22, "&:hover": { background: "#dc2626" } }}>
                  <CloseIcon sx={{ fontSize: "12px" }} />
                </IconButton>
              </div>
            ) : (
              <div className="relative w-28 h-28">
                <input type="file" accept="image/*" id="categoryFileInput" style={{ display: "none" }} onChange={handleImageChange} />
                <label htmlFor="categoryFileInput" className="w-28 h-28 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                  <AddPhotoAlternateIcon sx={{ color: "#94a3b8", fontSize: 28 }} />
                  <span className="text-xs text-slate-400 mt-1">Upload</span>
                </label>
                {uploadImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                    <CircularProgress size={24} sx={{ color: "#6366f1" }} />
                  </div>
                )}
              </div>
            )}
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category Name</label>
            <TextField fullWidth id="name" name="name" placeholder="e.g. Hair Care" value={formik.values.name} onChange={formik.handleChange} required sx={fieldSx} size="small" />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Button type="submit" variant="contained" fullWidth sx={{ py: "0.8rem", borderRadius: "10px", fontWeight: 600, background: "linear-gradient(135deg,#6366f1,#4f46e5)", "&:hover": { background: "linear-gradient(135deg,#4f46e5,#4338ca)" } }}>
              Create Category
            </Button>
          </Grid2>
        </Grid2>
      </form>

      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: "8px" }}>Category created successfully</Alert>
      </Snackbar>
    </div>
  );
};

export default CategoryForm;