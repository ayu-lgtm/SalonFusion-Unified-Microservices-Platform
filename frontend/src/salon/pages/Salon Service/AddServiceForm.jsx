import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  TextField, Button, MenuItem, Select, InputLabel, FormControl,
  CircularProgress, IconButton, Snackbar, Alert, Grid2,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesBySalon } from "../../../Redux/Category/action";
import { createServiceAction } from "../../../Redux/Salon Services/action";

const ServiceForm = () => {
  const [uploadImage, setUploadingImage] = useState(false);
  const [snackbarOpen, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const { category, salon } = useSelector((store) => store);

  const formik = useFormik({
    initialValues: { name: "", description: "", price: "", duration: "", image: "", category: "" },
    onSubmit: (values) => {
      dispatch(createServiceAction({ service: values, jwt: localStorage.getItem("jwt") }));
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

  useEffect(() => {
    if (salon.salon) {
      dispatch(getCategoriesBySalon({ salonId: salon.salon.id, jwt: localStorage.getItem("jwt") }));
    }
  }, [salon.salon]);

  const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.875rem" } };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Add New Service</h1>
        <p className="text-slate-500 text-sm mt-0.5">Fill in the details to list a new service</p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <Grid2 container spacing={3}>
          {/* Image upload */}
          <Grid2 size={{ xs: 12 }}>
            <label className="block text-sm font-medium text-slate-700 mb-2">Service Image</label>
            {formik.values.image ? (
              <div className="relative w-28 h-28">
                <img className="w-28 h-28 object-cover rounded-xl border border-slate-200" src={formik.values.image} alt="Service" />
                <IconButton
                  onClick={handleRemoveImage}
                  size="small"
                  sx={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "white", width: 22, height: 22, "&:hover": { background: "#dc2626" } }}
                >
                  <CloseIcon sx={{ fontSize: "12px" }} />
                </IconButton>
              </div>
            ) : (
              <div className="relative w-28 h-28">
                <input type="file" accept="image/*" id="serviceFileInput" style={{ display: "none" }} onChange={handleImageChange} />
                <label htmlFor="serviceFileInput" className="w-28 h-28 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Name</label>
            <TextField fullWidth id="name" name="name" placeholder="e.g. Premium Hair Cut" value={formik.values.name} onChange={formik.handleChange} required sx={fieldSx} size="small" />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <TextField fullWidth id="description" name="description" placeholder="Describe what's included..." multiline rows={3} value={formik.values.description} onChange={formik.handleChange} required sx={fieldSx} />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (₹)</label>
            <TextField fullWidth id="price" name="price" type="number" placeholder="500" value={formik.values.price} onChange={formik.handleChange} required sx={fieldSx} size="small" />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration (minutes)</label>
            <TextField fullWidth id="duration" name="duration" type="number" placeholder="30" value={formik.values.duration} onChange={formik.handleChange} required sx={fieldSx} size="small" />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <FormControl fullWidth size="small">
              <Select
                value={formik.values.category}
                name="category"
                onChange={formik.handleChange}
                displayEmpty
                sx={{ borderRadius: "8px", fontSize: "0.875rem" }}
              >
                <MenuItem value="" disabled><span className="text-slate-400">Select a category</span></MenuItem>
                {category.categories.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: "0.8rem", borderRadius: "10px", fontWeight: 600,
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                "&:hover": { background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)" },
              }}
            >
              Add Service
            </Button>
          </Grid2>
        </Grid2>
      </form>

      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: "8px" }}>Service created successfully</Alert>
      </Snackbar>
    </div>
  );
};

export default ServiceForm;