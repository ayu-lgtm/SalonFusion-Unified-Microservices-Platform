import React, { useEffect } from "react";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Badge, Drawer, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotificationsBySalon } from "../../../Redux/Notifications/action";
import useNotificationWebsoket from "../../../util/useNotificationWebsoket";

const Navbar = ({ DrawerList }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const { notification, salon } = useSelector((store) => store);
  const dispatch = useDispatch();

  const toggleDrawer = (newOpen) => () => setOpen(newOpen);

  useEffect(() => {
    if (salon.salon?.id) {
      dispatch(fetchNotificationsBySalon({ salonId: salon.salon.id, jwt: localStorage.getItem("jwt") }));
    }
  }, [salon.salon?.id]);

  useNotificationWebsoket(salon.salon?.id, "salon");

  return (
    <header className="h-[64px] flex items-center justify-between px-5 bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <IconButton
          onClick={toggleDrawer(true)}
          size="small"
          sx={{ color: "#6366f1", background: "#eef2ff", borderRadius: "8px", "&:hover": { background: "#e0e7ff" }, width: 36, height: 36 }}
        >
          <MenuOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">SF</span>
          </div>
          <span className="font-semibold text-slate-800 hidden sm:block">SalonFusion</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {salon.salon?.name && (
          <span className="hidden sm:block text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
            {salon.salon.name}
          </span>
        )}
        <IconButton
          onClick={() => navigate("/salon-dashboard/notifications")}
          size="small"
          sx={{ color: "#64748b", "&:hover": { color: "#6366f1", background: "#eef2ff" } }}
        >
          <Badge
            badgeContent={notification.notifications.filter(n => !n.isRead).length}
            sx={{ "& .MuiBadge-badge": { background: "#6366f1", color: "white", fontSize: "10px", minWidth: "16px", height: "16px" } }}
          >
            <NotificationsNoneOutlinedIcon sx={{ fontSize: 22 }} />
          </Badge>
        </IconButton>
      </div>

      <Drawer open={open} onClose={toggleDrawer(false)} PaperProps={{ sx: { boxShadow: "4px 0 24px rgba(0,0,0,0.08)" } }}>
        <DrawerList toggleDrawer={toggleDrawer} />
      </Drawer>
    </header>
  );
};

export default Navbar;