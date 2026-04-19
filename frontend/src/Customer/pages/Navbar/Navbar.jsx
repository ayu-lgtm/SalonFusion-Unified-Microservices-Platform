import {
  Avatar,
  Badge,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../Redux/Auth/action";
import useNotificationWebsoket from "../../../util/useNotificationWebsoket";
import { fetchNotificationsByUser } from "../../../Redux/Notifications/action";
import { useTheme } from "@emotion/react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SearchIcon from "@mui/icons-material/Search";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, notification } = useSelector((store) => store);
  const dispatch = useDispatch();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMenuClick = (path) => () => {
    if (path === "/logout") {
      dispatch(logout());
      navigate("/");
      handleClose();
      return;
    }
    navigate(path);
    handleClose();
  };

  useEffect(() => {
    if (auth.user?.id) {
      dispatch(fetchNotificationsByUser({ userId: auth.user.id, jwt: localStorage.getItem("jwt") }));
    }
  }, [auth.user]);

  useNotificationWebsoket(auth.user?.id, "user");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-xs">SF</span>
            </div>
            <span className="font-semibold text-slate-800 text-lg tracking-tight">SalonFusion</span>
          </button>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/search")}
              className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors"
            >
              <SearchIcon sx={{ fontSize: 16 }} /> Find Salons
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate("/become-partner")}
              variant="outlined"
              size="small"
              sx={{
                borderColor: "#6366f1",
                color: "#6366f1",
                borderRadius: "8px",
                fontSize: "0.8rem",
                px: 2,
                "&:hover": { borderColor: "#4f46e5", background: "#eef2ff" },
              }}
            >
              Become a Partner
            </Button>

            <IconButton
              onClick={() => navigate("/notifications")}
              size="small"
              sx={{ color: "#64748b", "&:hover": { color: "#6366f1", background: "#eef2ff" } }}
            >
              <Badge
                badgeContent={notification.unreadCount}
                sx={{ "& .MuiBadge-badge": { background: "#6366f1", color: "white", fontSize: "10px", minWidth: "16px", height: "16px" } }}
              >
                <NotificationsNoneIcon sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>

            {auth.user?.id ? (
              <>
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ p: 0.5 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#6366f1",
                      width: 34,
                      height: 34,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {auth.user?.fullName?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                      border: "1px solid #e2e8f0",
                      minWidth: 200,
                      overflow: "visible",
                    },
                  }}
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="font-semibold text-slate-800 text-sm">{auth.user?.fullName}</p>
                    <p className="text-slate-500 text-xs">{auth.user?.email}</p>
                  </div>
                  <MenuItem onClick={handleMenuClick("/bookings")} sx={{ gap: 1.5, fontSize: "0.875rem", py: 1.25 }}>
                    <BookmarkBorderIcon sx={{ fontSize: 18, color: "#64748b" }} /> My Bookings
                  </MenuItem>
                  {auth.user?.role === "SALON_OWNER" && (
                    <MenuItem onClick={handleMenuClick("/salon-dashboard")} sx={{ gap: 1.5, fontSize: "0.875rem", py: 1.25 }}>
                      <DashboardOutlinedIcon sx={{ fontSize: 18, color: "#64748b" }} /> Dashboard
                    </MenuItem>
                  )}
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={handleMenuClick("/logout")} sx={{ gap: 1.5, fontSize: "0.875rem", py: 1.25, color: "#ef4444" }}>
                    <LogoutIcon sx={{ fontSize: 18 }} /> Sign out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <IconButton
                onClick={() => navigate("/login")}
                size="small"
                sx={{ color: "#64748b", "&:hover": { color: "#6366f1", background: "#eef2ff" } }}
              >
                <PersonOutlineIcon sx={{ fontSize: 24 }} />
              </IconButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;