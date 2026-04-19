import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Rating, InputLabel, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createReview } from "../../../../Redux/Review/action";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";

const CreateReviewForm = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const formik = useFormik({
    initialValues: { reviewText: "", reviewRating: 0 },
    validationSchema: Yup.object({
      reviewText: Yup.string().required("Review text is required").min(10, "Review must be at least 10 characters long"),
      reviewRating: Yup.number().required("Rating is required").min(0, "Rating must be at least 0").max(5, "Rating cannot be more than 5"),
    }),
    onSubmit: (values) => {
      if (id) {
        dispatch(createReview({ reviewData: values, salonId: id, jwt: localStorage.getItem("jwt") }));
      }
    },
  });

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 w-full max-w-lg shadow-sm">
      <div className="mb-6">
        <h2 className="font-bold text-slate-900 text-lg mb-1">Write a Review</h2>
        <p className="text-slate-500 text-sm">Share your experience with others</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {/* Rating */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Your Rating</label>
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <Rating
              id="reviewRating"
              name="reviewRating"
              value={formik.values.reviewRating}
              onChange={(_, newValue) => formik.setFieldValue("reviewRating", newValue)}
              precision={0.5}
              icon={<StarIcon sx={{ fontSize: 28, color: "#f59e0b" }} />}
              emptyIcon={<StarOutlineIcon sx={{ fontSize: 28, color: "#cbd5e1" }} />}
            />
            <span className="text-sm font-semibold text-slate-700 ml-1">
              {formik.values.reviewRating > 0 ? `${formik.values.reviewRating}/5` : "Not rated"}
            </span>
          </div>
          {formik.touched.reviewRating && formik.errors.reviewRating && (
            <Typography color="error" variant="body2" sx={{ fontSize: "0.75rem" }}>{formik.errors.reviewRating}</Typography>
          )}
        </div>

        {/* Review text */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Your Review</label>
          <TextField
            fullWidth
            id="reviewText"
            name="reviewText"
            placeholder="Tell others what you liked or didn't like..."
            variant="outlined"
            multiline
            rows={4}
            value={formik.values.reviewText}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.reviewText && Boolean(formik.errors.reviewText)}
            helperText={formik.touched.reviewText && formik.errors.reviewText}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.875rem" } }}
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            borderRadius: "10px", py: "0.75rem",
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            fontWeight: 600,
            "&:hover": { background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)" },
          }}
        >
          Submit Review
        </Button>
      </form>
    </div>
  );
};

export default CreateReviewForm;