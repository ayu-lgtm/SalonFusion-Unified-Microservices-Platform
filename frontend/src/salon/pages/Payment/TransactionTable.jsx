import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalonBookings } from "../../../Redux/Booking/action";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    background: "#f8fafc", color: "#64748b", fontWeight: 600, fontSize: "0.72rem",
    letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", padding: "12px 16px",
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 13, padding: "14px 16px", borderBottom: "1px solid #f8fafc" },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:hover": { background: "#fafafa" },
  "&:last-child td": { border: 0 },
  transition: "background 0.15s",
}));

export default function TransactionTable() {
  const { booking } = useSelector((store) => store);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchSalonBookings({ jwt: localStorage.getItem("jwt") }));
  }, []);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
      <TableContainer component="div">
        <Table sx={{ minWidth: 600 }} aria-label="transaction table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Booking ID</StyledTableCell>
              <StyledTableCell align="right">Amount</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {booking.bookings.map((item) => (
              <StyledTableRow key={item.id}>
                <StyledTableCell>
                  <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 12 }} />
                    {item.startTime.split("T")[0]}
                  </div>
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
                  <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">#{item.id}</span>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <div className="flex items-center justify-end font-bold text-slate-900">
                    <CurrencyRupeeIcon sx={{ fontSize: 13 }} />{item.totalPrice}
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}