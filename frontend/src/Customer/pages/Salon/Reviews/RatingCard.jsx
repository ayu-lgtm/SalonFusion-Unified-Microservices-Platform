import { Box, Grid2, LinearProgress, Rating } from "@mui/material";
import React from "react";
import StarIcon from "@mui/icons-material/Star";

const ratingRows = [
  { label: "Excellent", value: 40, color: "#10b981" },
  { label: "Very Good", value: 30, color: "#6366f1" },
  { label: "Good", value: 25, color: "#f59e0b" },
  { label: "Average", value: 21, color: "#f97316" },
  { label: "Poor", value: 10, color: "#ef4444" },
];

const RatingCard = ({ totalReview }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Summary */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <div className="text-center">
          <p className="text-4xl font-bold text-slate-900">4.6</p>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon key={i} sx={{ fontSize: 14, color: i <= 4 ? "#f59e0b" : "#e2e8f0" }} />
            ))}
          </div>
        </div>
        <div className="w-px h-12 bg-slate-100" />
        <div>
          <p className="font-semibold text-slate-700">{totalReview} reviews</p>
          <p className="text-slate-400 text-xs">Overall rating</p>
        </div>
      </div>

      {/* Rating bars */}
      <div className="space-y-3">
        {ratingRows.map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-16 flex-shrink-0">{label}</span>
            <div className="flex-1">
              <LinearProgress
                variant="determinate"
                value={value}
                sx={{
                  height: 6,
                  borderRadius: 99,
                  bgcolor: "#f1f5f9",
                  "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 99 },
                }}
              />
            </div>
            <span className="text-xs text-slate-400 w-8 text-right">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingCard;