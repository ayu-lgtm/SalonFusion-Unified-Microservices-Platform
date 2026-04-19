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
import { useSelector } from "react-redux";
import { useState } from "react";
import UpdateCategoryForm from "./UpdateCategoryForm";

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
  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
  width: "min(440px, 95vw)", bgcolor: "background.paper", borderRadius: "16px",
  boxShadow: "0 25px 50px rgba(0,0,0,0.15)", p: 0, overflow: "hidden",
};

export default function CategoryTable() {
  const navigate = useNavigate();
  const { category } = useSelector((store) => store);
  const [snackbarOpen, setOpenSnackbar] = useState(false);
  const [openUpdateCategoryForm, setUpdateCategoryForm] = useState(false);

  const handleOpenUpdateCategoryForm = (id) => () => {
    navigate(`/salon-dashboard/category/${id}`);
    setUpdateCategoryForm(true);
  };
  const handleCloseUpdateCategoryForm = () => setUpdateCategoryForm(false);

  React.useEffect(() => {
    if (category.updated || category.error) setOpenSnackbar(true);
  }, [category.updated, category.error]);

  return (
    <>
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <TableContainer component="div">
          <Table sx={{ minWidth: 500 }} aria-label="categories table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Category Name</StyledTableCell>
                <StyledTableCell align="right">Edit</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {category.categories.map((item) => (
                <StyledTableRow key={item.id}>
                  <StyledTableCell>
                    <img className="w-12 h-12 rounded-xl object-cover" src={item.image} alt={item.name} />
                  </StyledTableCell>
                  <StyledTableCell>
                    <span className="font-semibold text-slate-800">{item.name}</span>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton
                      onClick={handleOpenUpdateCategoryForm(item.id)}
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

      <Modal open={openUpdateCategoryForm} onClose={handleCloseUpdateCategoryForm}>
        <Box sx={modalStyle}>
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-lg">Update Category</h2>
          </div>
          <UpdateCategoryForm onClose={handleCloseUpdateCategoryForm} />
        </Box>
      </Modal>

      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={category.updated ? "success" : "error"} variant="filled" sx={{ borderRadius: "8px" }} onClose={() => setOpenSnackbar(false)}>
          {category.updated ? "Category updated successfully" : category.error || "An error occurred"}
        </Alert>
      </Snackbar>
    </>
  );
}