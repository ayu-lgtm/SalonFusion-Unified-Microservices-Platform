import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import React from "react";

const SelectedServiceList = ({ services, handleRemoveService }) => {
  return (
    <div className="space-y-2">
      {services.map((item) => (
        <div key={item.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 group">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="flex items-center text-sm font-semibold text-indigo-600">
              <CurrencyRupeeIcon sx={{ fontSize: 13 }} />{item.price}
            </span>
            <IconButton
              onClick={() => handleRemoveService(item.id)}
              size="small"
              sx={{ color: "#94a3b8", "&:hover": { color: "#ef4444", background: "#fef2f2" }, p: 0.5 }}
            >
              <Close sx={{ fontSize: 14 }} />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectedServiceList;