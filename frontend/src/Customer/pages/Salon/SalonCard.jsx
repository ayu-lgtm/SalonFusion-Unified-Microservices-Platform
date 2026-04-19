import React from "react";
import StarIcon from "@mui/icons-material/Star";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useNavigate } from "react-router-dom";

const SalonCard = ({ salon }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/salon/${salon.id}`)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 w-64 sm:w-72"
    >
      <div className="relative overflow-hidden h-48">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={salon.images[0] || "https://images.pexels.com/photos/4625615/pexels-photo-4625615.jpeg?auto=compress&cs=tinysrgb&w=600"}
          alt={salon.name}
        />
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
            <StarIcon sx={{ fontSize: 13, color: "#f59e0b" }} />
            <span className="text-xs font-semibold text-slate-700">4.5</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4 space-y-2">
        <h1 className="font-semibold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">{salon.name}</h1>
        <p className="text-slate-500 text-xs line-clamp-2">Professional haircut and styling tailored to your preferences.</p>
        <div className="flex items-center gap-1 text-slate-400 pt-1">
          <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />
          <span className="text-xs">{salon.address}, {salon.city}</span>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;