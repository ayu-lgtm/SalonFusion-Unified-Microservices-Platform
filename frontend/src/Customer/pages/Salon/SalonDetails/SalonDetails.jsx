import React, { useState } from "react";
import { Button, Divider } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchSalonById } from "../../../../Redux/Salon/action";
import { useParams } from "react-router-dom";
import { getCategoriesBySalon } from "../../../../Redux/Category/action";
import SalonDetail from "./SalonDetail";
import SalonServiceDetails from "./SalonServiceDetails";
import CreateReviewForm from "../Reviews/CreateReviewForm";
import Review from "../Reviews/Review";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const tabs = [
  { name: "All Services", icon: <GridViewOutlinedIcon sx={{ fontSize: 16 }} /> },
  { name: "Reviews", icon: <StarBorderOutlinedIcon sx={{ fontSize: 16 }} /> },
  { name: "Create Review", icon: <EditOutlinedIcon sx={{ fontSize: 16 }} /> },
];

const SalonDetails = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const dispatch = useDispatch();
  const { id } = useParams();

  React.useEffect(() => {
    dispatch(fetchSalonById(id));
    dispatch(getCategoriesBySalon({ salonId: id, jwt: localStorage.getItem("jwt") }));
  }, [id]);

  return (
    <div className="px-4 sm:px-6 lg:px-20 py-8">
      <SalonDetail />
      <div className="space-y-4">
        <div className="flex gap-2 border-b border-slate-100 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab.name === activeTab?.name
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        {activeTab?.name === "Create Review" ? (
          <div className="flex justify-center">
            <CreateReviewForm />
          </div>
        ) : activeTab.name === "Reviews" ? (
          <Review />
        ) : (
          <SalonServiceDetails />
        )}
      </div>
    </div>
  );
};

export default SalonDetails;