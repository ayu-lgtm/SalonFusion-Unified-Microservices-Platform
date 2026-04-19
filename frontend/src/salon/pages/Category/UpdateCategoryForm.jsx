import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  TextField, Button, CircularProgress, IconButton, Grid2,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryById, updateCategory } from "../../../Redux/Category/action";
import { useParams } from "react-router-dom";

const UpdateCategoryForm = ({ onClose }) => {
  const [uploadImage, setUploadingImage] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { category } = useSelector((store) => store);

  const formik = useFormik({
    initialValues: { name: "", image: "" },
    onSubmit: (values) => {
      dispatch(updateCategory({ category: values, id }));
      onClose();
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

  useEffect(() => { dispatch(getCategoryById(id)); }, []);

  useEffect(() => {
    if (category.category) {
      formik.setFieldValue("name", category.category.name);
      formik.setFieldValue("image", category.category.image);
    }
  }, [category.category]);

  const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.875rem" } };

  return (
    <div className="p-5">
      <form onSubmit={formik.handleSubmit}>
        <Grid2 container spacing={2.5}>
          <Grid2 size={{ xs: 12 }}>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Image</label>
            {formik.values.image ? (
              <div className="relative w-24 h-24">
                <img className="w-24 h-24 object-cover rounded-xl border border-slate-200" src={formik.values.image} alt="" />
                <IconButton onClick={handleRemoveImage} size="small" sx={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "white", width: 22, height: 22, "&:hover": { background: "#dc2626" } }}>
                  <CloseIcon sx={{ fontSize: "12px" }} />
                </IconButton>
              </div>
            ) : (
              <div className="relative w-24 h-24">
                <input type="file" accept="image/*" id="updateCategoryFileInput" style={{ display: "none" }} onChange={handleImageChange} />
                <label htmlFor="updateCategoryFileInput" className="w-24 h-24 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                  <AddPhotoAlternateIcon sx={{ color: "#94a3b8", fontSize: 24 }} />
                  <span className="text-xs text-slate-400 mt-1">Upload</span>
                </label>
                {uploadImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                    <CircularProgress size={20} sx={{ color: "#6366f1" }} />
                  </div>
                )}
              </div>
            )}
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TextField fullWidth label="Category Name" id="name" name="name" value={formik.values.name} onChange={formik.handleChange} required sx={fieldSx} size="small" />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Button type="submit" variant="contained" fullWidth sx={{ py: "0.75rem", borderRadius: "10px", fontWeight: 600, background: "linear-gradient(135deg,#6366f1,#4f46e5)", "&:hover": { background: "linear-gradient(135deg,#4f46e5,#4338ca)" } }}>
              Update Category
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </div>
  );
};

export default UpdateCategoryForm;