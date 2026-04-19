import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    background: "#f8fafc", color: "#64748b", fontWeight: 600, fontSize: "0.72rem",
    letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", padding: "12px 16px",
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 13, padding: "14px 16px", borderBottom: "1px solid #f8fafc" },
}));

const PayoutsTable = () => {
  const { booking } = useSelector((store) => store);
  const dispatch = useDispatch();

  React.useEffect(() => {}, [dispatch]);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
      <TableContainer component="div">
        <Table sx={{ minWidth: 500 }} aria-label="payouts table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Amount</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {booking.bookings.map((item) => (
              <TableRow key={item.id} sx={{ "&:hover": { background: "#fafafa" }, "&:last-child td": { border: 0 } }}>
                <TableCell sx={{ padding: "14px 16px", fontSize: 13 }}>{item.id}</TableCell>
                <TableCell sx={{ padding: "14px 16px", fontSize: 13 }}>
                  <div className="flex flex-wrap gap-2">
                    {item.services?.map((orderItem) => (
                      <span key={orderItem.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {orderItem.name}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell align="right" sx={{ padding: "14px 16px" }}>
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full font-medium">Pending</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PayoutsTable;