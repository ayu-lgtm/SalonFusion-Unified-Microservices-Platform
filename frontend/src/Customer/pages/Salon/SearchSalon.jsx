import React from "react";
import SalonList from "./SalonList";
import { useDispatch, useSelector } from "react-redux";
import { searchSalon } from "../../../Redux/Salon/action";
import SearchIcon from "@mui/icons-material/Search";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";

const SearchSalon = () => {
  const { salon } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    dispatch(searchSalon({ jwt: localStorage.getItem("jwt"), city: e.target.value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Salons Near You</h1>
        <p className="text-slate-500">Search by city to discover the best beauty professionals</p>
      </div>

      {/* Search bar */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-indigo-400 focus-within:shadow-indigo-50 focus-within:shadow-md transition-all">
          <SearchIcon sx={{ color: "#6366f1", fontSize: 22, flexShrink: 0 }} />
          <input
            onChange={handleSearch}
            className="flex-1 outline-none text-slate-800 placeholder-slate-400 text-sm bg-transparent"
            placeholder="Search by city (e.g. Mumbai, Delhi)..."
          />
          <div className="h-6 w-px bg-slate-200" />
          <button className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors text-sm">
            <TuneOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      </div>

      {/* Results */}
      {salon.searchSalons.length > 0 ? (
        <div>
          <p className="text-slate-500 text-sm mb-5 font-medium">{salon.searchSalons.length} salon{salon.searchSalons.length !== 1 ? "s" : ""} found</p>
          <SalonList salons={salon.searchSalons} />
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <SearchIcon sx={{ color: "#94a3b8", fontSize: 32 }} />
          </div>
          <h3 className="font-semibold text-slate-700 mb-1">Search for salons</h3>
          <p className="text-slate-400 text-sm">Type a city name above to find salons near you</p>
        </div>
      )}
    </div>
  );
};

export default SearchSalon;