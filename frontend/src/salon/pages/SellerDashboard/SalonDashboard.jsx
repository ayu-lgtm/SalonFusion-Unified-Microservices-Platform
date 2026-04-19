import React, { useEffect } from "react";
import Navbar from "../../../admin seller/components/navbar/Navbar";
import SalonRoutes from "../../../routes/SalonRoutes";
import { useDispatch } from "react-redux";
import { fetchSalonByOwner } from "../../../Redux/Salon/action";
import SalonDrawerList from "../../components/SideBar/DrawerList";
import { getSalonReport } from "../../../Redux/Booking/action";

const SalonDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSalonByOwner(localStorage.getItem("jwt")));
    dispatch(getSalonReport(localStorage.getItem("jwt")));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar DrawerList={SalonDrawerList} />
      <section className="lg:flex" style={{ minHeight: "calc(100vh - 64px)" }}>
        {/* Sidebar */}
        <aside className="hidden lg:block w-[260px] flex-shrink-0 bg-white border-r border-slate-100 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto">
          <SalonDrawerList />
        </aside>
        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto min-w-0">
          <SalonRoutes />
        </main>
      </section>
    </div>
  );
};

export default SalonDashboard;