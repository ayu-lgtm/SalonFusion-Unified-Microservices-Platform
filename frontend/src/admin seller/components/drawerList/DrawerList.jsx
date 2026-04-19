import * as React from "react";
import Divider from "@mui/material/Divider";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../Redux/Auth/action";
import { useDispatch } from "react-redux";

const DrawerList = ({ toggleDrawer, menu, menu2 }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => dispatch(logout());

  const handleClick = (item) => () => {
    if (item.name === "Logout") handleLogout();
    navigate(item.path);
    if (toggleDrawer) toggleDrawer(false)();
  };

  const NavItem = ({ item }) => {
    const isActive = item.path === location.pathname;
    return (
      <div onClick={handleClick(item)} className="px-3 cursor-pointer">
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
          isActive
            ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}>
          <span className={`flex-shrink-0 ${isActive ? "text-white" : "text-indigo-500"}`}>
            {isActive ? item.activeIcon : item.icon}
          </span>
          <span className={`text-sm font-medium ${isActive ? "text-white" : "text-slate-700"}`}>
            {item.name}
          </span>
          {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col w-[260px] bg-white">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">SF</span>
          </div>
          <span className="font-semibold text-slate-800">SalonFusion</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        <p className="px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
        {menu.map((item) => <NavItem key={item.name} item={item} />)}
      </nav>

      {/* Bottom nav */}
      <div className="border-t border-slate-100 pt-3 pb-5 space-y-1">
        {menu2.map((item) => <NavItem key={item.name} item={item} />)}
      </div>
    </div>
  );
};

export default DrawerList;