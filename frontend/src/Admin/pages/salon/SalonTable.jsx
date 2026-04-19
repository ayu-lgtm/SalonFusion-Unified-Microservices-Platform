import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalons } from "../../../Redux/Salon/action";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";

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

const SalonTable = () => {
  const dispatch = useDispatch();
  const { salon } = useSelector((store) => store);

  useEffect(() => { dispatch(fetchSalons()); }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">All Listed Salons</h1>
        <p className="text-slate-500 text-sm mt-0.5">{salon.salons.length} salons registered</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <TableContainer component="div">
          <Table sx={{ minWidth: 700 }} aria-label="salon table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Salon</StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>Owner</StyledTableCell>
                <StyledTableCell align="right">City</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salon.salons.map((item) => (
                <StyledTableRow key={item.id}>
                  <StyledTableCell>
                    <div className="flex items-center gap-3">
                      <img className="w-12 h-12 rounded-xl object-cover flex-shrink-0" src={item.images[0]} alt={item.name} />
                      <div>
                        <p className="font-semibold text-slate-800">{item.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-xs text-emerald-600">Active</span>
                        </div>
                      </div>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className="flex items-start gap-1.5 text-slate-500 text-xs">
                      <LocationOnOutlinedIcon sx={{ fontSize: 14, mt: 0.3, flexShrink: 0 }} />
                      <span className="leading-relaxed">{item.address}</span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 text-xs font-bold">{item.owner?.fullName?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{item.owner.fullName}</p>
                        <p className="text-xs text-slate-400">{item.owner.email}</p>
                      </div>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full font-medium">{item.city}</span>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default SalonTable;