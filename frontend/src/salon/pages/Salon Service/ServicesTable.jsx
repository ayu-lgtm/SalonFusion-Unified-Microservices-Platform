import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Alert, Box, IconButton, Modal, Snackbar, styled } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServicesBySalonId } from "../../../Redux/Salon Services/action";
import UpdateServiceForm from "./UpdateSalonServiceForm";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    background: "#f8fafc", color: "#64748b", fontWeight: 600, fontSize: "0.72rem",
    letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", padding: "12px 16px",
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 13, padding: "12px 16px", borderBottom: "1px solid #f8fafc" },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:hover": { background: "#fafafa" },
  "&:last-child td": { border: 0 },
  transition: "background 0.15s",
}));

const modalStyle = {
  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
  width: "min(480px, 95vw)", bgcolor: "background.paper", borderRadius: "16px",
  boxShadow: "0 25px 50px rgba(0,0,0,0.15)", p: 0, overflow: "hidden",
};

export default function ServicesTable() {
  const { salon, service } = useSelector((store) => store);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [snackbarOpen, setOpenSnackbar] = React.useState(false);
  const [openUpdateServiceForm, setUpdateServiceForm] = React.useState(false);

  const handleOpenUpdateServiceForm = (id) => () => {
    navigate(`/salon-dashboard/services/${id}`);
    setUpdateServiceForm(true);
  };
  const handleCloseUpdateServiceForm = () => setUpdateServiceForm(false);

  React.useEffect(() => {
    if (service.updated || service.error) setOpenSnackbar(true);
  }, [service.updated, service.error]);

  React.useEffect(() => {
    if (salon.salon?.id) {
      dispatch(fetchServicesBySalonId({ salonId: salon.salon?.id, jwt: localStorage.getItem("jwt") }));
    }
  }, [salon.salon]);

  return (
    <>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Services</h1>
          <p className="text-slate-500 text-sm">{service.services.length} services listed</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <TableContainer component="div">
            <Table sx={{ minWidth: 600 }} aria-label="services table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Service</StyledTableCell>
                  <StyledTableCell>Details</StyledTableCell>
                  <StyledTableCell>Price</StyledTableCell>
                  <StyledTableCell align="right">Edit</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {service.services.map((item) => (
                  <StyledTableRow key={item.id}>
                    <StyledTableCell>
                      <div className="flex items-center gap-3">
                        <img className="w-12 h-12 rounded-xl object-cover flex-shrink-0" src={item.image} alt={item.name} />
                        <span className="font-semibold text-slate-800">{item.name}</span>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <AccessTimeIcon sx={{ fontSize: 13 }} />
                        {item.duration} mins
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className="flex items-center font-semibold text-slate-900 text-sm">
                        <CurrencyRupeeIcon sx={{ fontSize: 13 }} />{item.price}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        onClick={handleOpenUpdateServiceForm(item.id)}
                        size="small"
                        sx={{ color: "#6366f1", background: "#eef2ff", borderRadius: "8px", "&:hover": { background: "#e0e7ff" }, width: 32, height: 32 }}
                      >
                        <EditOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <Modal open={openUpdateServiceForm} onClose={handleCloseUpdateServiceForm}>
        <Box sx={modalStyle}>
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-lg">Update Service</h2>
          </div>
          <div className="p-2">
            <UpdateServiceForm onClose={handleCloseUpdateServiceForm} />
          </div>
        </Box>
      </Modal>

      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={service.updated ? "success" : "error"} variant="filled" sx={{ borderRadius: "8px" }} onClose={() => setOpenSnackbar(false)}>
          {service.updated ? "Service updated successfully" : service.error?.response?.data?.message || "An error occurred"}
        </Alert>
      </Snackbar>
    </>
  );
}