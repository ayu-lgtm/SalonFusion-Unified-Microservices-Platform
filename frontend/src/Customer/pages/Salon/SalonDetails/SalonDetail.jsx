import React from "react";
import { useSelector } from "react-redux";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";

const SalonDetail = () => {
  const { salon } = useSelector((store) => store);
  return (
    <div className="space-y-6 mb-12">
      {/* Image grid */}
      <section className="grid grid-cols-3 gap-3 h-72 sm:h-96 rounded-2xl overflow-hidden">
        <div className="col-span-2 overflow-hidden">
          <img
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            src={salon.salon?.images[0]}
            alt=""
          />
        </div>
        <div className="col-span-1 grid grid-rows-2 gap-3">
          <div className="overflow-hidden rounded-tr-2xl">
            <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src={salon.salon?.images[1]} alt="" />
          </div>
          <div className="overflow-hidden rounded-br-2xl">
            <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src={salon.salon?.images[2]} alt="" />
          </div>
        </div>
      </section>

      {/* Salon info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl text-slate-900">{salon.salon?.name}</h1>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
            <span>{salon.salon?.address}, {salon.salon?.city}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <AccessTimeIcon sx={{ fontSize: 16 }} />
            <span>{salon.salon?.openTime} – {salon.salon?.closeTime}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 self-start">
          <StarIcon sx={{ fontSize: 16, color: "#10b981" }} />
          <span className="font-bold text-emerald-700">4.5</span>
          <span className="text-emerald-600 text-xs">(120 reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default SalonDetail;