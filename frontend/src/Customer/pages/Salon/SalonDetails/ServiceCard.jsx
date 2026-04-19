import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Button } from "@mui/material";

const ServiceCard = ({ service, isSelected, onSelect, onRemove }) => {
  return (
    <div className={`flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-200 ${isSelected ? "border-indigo-200 bg-indigo-50/50" : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"}`}>
      <div className="space-y-1.5 flex-1 min-w-0">
        <h1 className="text-base font-semibold text-slate-900">{service.name}</h1>
        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{service.description}</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 text-slate-700 font-semibold text-sm">
            <CurrencyRupeeIcon sx={{ fontSize: 14 }} />
            {service.price}
          </div>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <AccessTimeIcon sx={{ fontSize: 13 }} />
            {service.duration} mins
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <div className="w-24 h-24 rounded-xl overflow-hidden">
          <img className="w-full h-full object-cover" src={service.image} alt={service.name} />
        </div>
        <button
          onClick={() => isSelected ? onRemove(service.id) : onSelect(service)}
          className={`w-full flex items-center justify-center gap-1 text-xs font-semibold py-1.5 px-3 rounded-lg border transition-all ${
            isSelected
              ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
              : "border-indigo-300 bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {isSelected ? <><RemoveIcon sx={{ fontSize: 13 }} /> Remove</> : <><AddIcon sx={{ fontSize: 13 }} /> Add</>}
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;