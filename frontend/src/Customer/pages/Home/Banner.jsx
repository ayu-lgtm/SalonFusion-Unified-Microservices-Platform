import React from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full relative h-[85vh] min-h-[500px]">
      <video
        className="w-full h-full object-cover"
        autoPlay
        autoFocus
        muted
        src="https://booksy-public.s3.amazonaws.com/horizontal_.webm"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <StarIcon sx={{ fontSize: 14, color: "#fbbf24" }} />
          <span className="text-white text-xs font-medium">Trusted by 2,000+ salons across India</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          Be Your <span className="text-indigo-400">Beautiful</span> Self
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl font-normal mb-10 max-w-xl">
          Discover and book beauty & wellness services near you
        </p>

        {/* Search bar */}
        <div
          onClick={() => navigate("/search")}
          className="cursor-pointer flex items-center gap-3 bg-white rounded-2xl px-5 py-4 w-full max-w-md shadow-2xl hover:shadow-indigo-500/20 transition-all group"
        >
          <SearchIcon sx={{ color: "#6366f1", fontSize: 22 }} />
          <span className="text-slate-400 text-sm flex-1 text-left">Search salon by city...</span>
          <span className="bg-indigo-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
            Search
          </span>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-6 mt-8">
          {[
            { value: "50K+", label: "Bookings" },
            { value: "2K+", label: "Salons" },
            { value: "4.8★", label: "Rating" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-white font-bold text-lg">{value}</p>
              <p className="text-white/60 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;