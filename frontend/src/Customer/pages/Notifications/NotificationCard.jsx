import React from "react";
import { useDispatch } from "react-redux";
import { markNotificationAsRead } from "../../../Redux/Notifications/action";
import { useNavigate } from "react-router-dom";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const NotificationCard = ({ item, type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReadNotification = () => {
    if (type === "USER") {
      dispatch(markNotificationAsRead({ notificationId: item.id, jwt: localStorage.getItem("jwt") }));
      navigate("/bookings");
    }
  };

  const isUnread = !item.isRead && type === "USER";

  return (
    <div
      onClick={handleReadNotification}
      className={`group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
        isUnread
          ? "bg-indigo-50/70 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200"
          : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isUnread ? "bg-indigo-100" : "bg-slate-100"}`}>
        <NotificationsNoneOutlinedIcon sx={{ fontSize: 20, color: isUnread ? "#6366f1" : "#94a3b8" }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-relaxed ${isUnread ? "text-slate-800 font-medium" : "text-slate-600"}`}>
            {item.description}
          </p>
          {isUnread && (
            <FiberManualRecordIcon sx={{ fontSize: 8, color: "#6366f1", flexShrink: 0, mt: 0.5 }} />
          )}
        </div>
        {item.booking?.services?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.booking.services.map((service) => (
              <span key={service.id} className="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                {service.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <ChevronRightIcon sx={{ fontSize: 16, color: "#94a3b8", flexShrink: 0, mt: 0.5, opacity: 0, transition: "opacity 0.2s" }} className="group-hover:opacity-100" />
    </div>
  );
};

export default NotificationCard;