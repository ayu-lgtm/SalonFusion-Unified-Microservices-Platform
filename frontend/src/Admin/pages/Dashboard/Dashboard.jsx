import React, { useState } from "react";
import AdminRoutes from "../../../routes/AdminRoutes";
import Navbar from "../../../admin seller/components/navbar/Navbar";
import AdminDrawerList from "../../components/DrawerList";
import { Alert, Snackbar } from "@mui/material";

const AdminDashboard = () => {
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <Navbar DrawerList={AdminDrawerList} />
        <section className="lg:flex" style={{ minHeight: "calc(100vh - 64px)" }}>
          <aside className="hidden lg:block w-[260px] flex-shrink-0 bg-white border-r border-slate-100 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto">
            <AdminDrawerList />
          </aside>
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto min-w-0">
            <AdminRoutes />
          </main>
        </section>
      </div>

      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: "8px" }} onClose={() => setOpenSnackbar(false)}>
          Category Updated successfully
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminDashboard;