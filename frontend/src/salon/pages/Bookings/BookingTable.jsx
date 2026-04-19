import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Chip, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalonBookings, updateBookingStatus } from "../../../Redux/Booking/action";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    background: "#f8fafc",
    color: "#64748b",
    fontWeight: 600,
    fontSize: "0.72rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    borderBottom: "1px solid #e2e8f0",
    padding: "12px 16px",
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 13, padding: "14px 16px", borderBottom: "1px solid #f8fafc" },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:hover": { background: "#fafafa" },
  "&:last-child td": { border: 0 },
  transition: "background 0.15s",
}));

const statusChip = {
  CONFIRMED: { label: "Confirmed", color: "success" },
  PENDING: { label: "Pending", sx: { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", fontWeight: 600, fontSize: "0.72rem", height: 24 } },
  CANCELLED: { label: "Cancelled", color: "error" },
};

export default function BookingTable() {
  const { salon, service, booking } = useSelector((store) => store);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchSalonBookings({ jwt: localStorage.getItem("jwt") }));
  }, []);

  const handleCancelBooking = (id) => () => {
    dispatch(updateBookingStatus({ bookingId: id, status: "CANCELLED", jwt: localStorage.getItem("jwt") }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-500 text-sm">{booking.bookings.length} total appointments</p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <TableContainer component="div">
          <Table sx={{ minWidth: 700 }} aria-label="bookings table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Services</StyledTableCell>
                <StyledTableCell>Date & Time</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>Customer</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell align="right">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {booking.bookings.map((item) => (
                <StyledTableRow key={item.id}>
                  <StyledTableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {item.services.map((service) => (
                        <span key={service.id} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md font-medium">
                          {service.name}
                        </span>
                      ))}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 text-xs font-medium">
                        <CalendarTodayOutlinedIcon sx={{ fontSize: 12 }} />
                        {item.startTime?.split("T")[0]}
                      </div>
                      <div className="text-slate-400 text-xs">{item.startTime?.split("T")[1]}</div>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <span className="font-semibold text-slate-900">₹{item.totalPrice}</span>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <PersonOutlineIcon sx={{ fontSize: 14, color: "#6366f1" }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{item.customer.fullName}</p>
                        <p className="text-xs text-slate-400">{item.customer.email}</p>
                      </div>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={item.status}
                      size="small"
                      color={item.status === "CONFIRMED" ? "success" : item.status === "CANCELLED" ? "error" : "default"}
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        height: 22,
                        ...(item.status === "PENDING" && { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }),
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      onClick={handleCancelBooking(item.id)}
                      disabled={item.status === "CANCELLED"}
                      color="error"
                      size="small"
                      variant={item.status === "CANCELLED" ? "contained" : "outlined"}
                      sx={{ borderRadius: "8px", fontSize: "0.72rem", minWidth: "80px", height: "28px" }}
                    >
                      {item.status === "CANCELLED" ? "Cancelled" : "Cancel"}
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}