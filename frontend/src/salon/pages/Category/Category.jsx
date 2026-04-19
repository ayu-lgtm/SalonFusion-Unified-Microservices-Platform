import React, { useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesBySalon } from "../../../Redux/Category/action";
import CategoryTable from "./CategoryTable";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const Category = () => {
  const [activeTab, setActiveTab] = useState(1);
  const { category, salon } = useSelector((store) => store);
  const dispatch = useDispatch();

  useEffect(() => {
    if (salon.salon) {
      dispatch(getCategoriesBySalon({ salonId: salon.salon.id, jwt: localStorage.getItem("jwt") }));
    }
  }, [salon.salon]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Categories</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your service categories</p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        {[
          { id: 1, label: "All Categories", icon: <GridViewOutlinedIcon sx={{ fontSize: 16 }} /> },
          { id: 2, label: "Create Category", icon: <AddCircleOutlineIcon sx={{ fontSize: 16 }} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 1 ? <CategoryTable /> : <CategoryForm />}
      </div>
    </div>
  );
};

export default Category;