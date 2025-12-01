import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TableHead,
  Paper,
  IconButton,
  Button,
  Typography,
  Skeleton,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchField from "@/@core/components/mui/search-field";
import axiosWithoutCredential from "@/configs/axios/axiosWithoutCredential";
import { toast } from "react-toastify";
import { BaseAppUrl } from "@/@core/utlis/secretVariable";
import TableLoader from "@/@core/components/loader/table-loader";

// ===== Main Table Component =====
export default function TypeInfoTable({
  handleOpenModal,
  shop_id,
  refreshKey,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [typeInfo, setTypeInfo] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => setRows(typeInfo), [typeInfo]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getAllTypeInfo = async () => {
    if (!shop_id) return;
    setLoading(true);
    try {
      const result = await axiosWithoutCredential.get(
        `/api/v1/type/all-type-by-store/${shop_id}`
      );
      setTypeInfo(result?.data?.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Failed to load data!");
    }
  };

  React.useEffect(() => {
    getAllTypeInfo();
  }, [shop_id, refreshKey]);

  const timerRef = React.useRef(null);
  const searchItem = (text) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const searchText = text.trim().toLowerCase();
      const searchInfo =
        searchText.length > 0
          ? typeInfo.filter((info) =>
              info?.type_info?.type_name?.toLowerCase().includes(searchText)
            )
          : typeInfo;
      setRows(searchInfo);
      setPage(0);
    }, 500);
  };

  const handleDeleteItem = async (id, item) => {
    try {
      await axiosWithoutCredential.put(`/api/v1/type/delete/${id}`, item);
      toast.success("Product Type successfully deleted!", {
        position: "top-center",
      });
      setRows((prev) => prev.filter((r) => r._id !== id));
      setTypeInfo((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!", { position: "top-center" });
    }
  };

  const iconBorder = {
    border: "1px solid",
    padding: "2px",
    margin: "2px",
    cursor: "pointer",
    width: ".85em",
    height: ".85em",
    borderRadius: 1,
  };

  if (!mounted) return null;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", position: "relative" }}>
      {/* Header */}
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography color="primary">Product Type Information</Typography>
        <Button
          variant="outlined"
          sx={{
            "&:hover": { backgroundColor: "primary.main", color: grey[300] },
          }}
          onClick={() => handleOpenModal("add-type")}
        >
          Assign Type
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ pr: 2, pb: 3, display: "flex", justifyContent: "flex-end" }}>
        <SearchField onInputText={searchItem} />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        {!loading ? (
          <TableLoader />
        ) : (
          <Table sx={{ minWidth: 300 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>No.</TableCell>
                <TableCell
                  sx={{ fontWeight: 600, textAlign: "left", minWidth: 100 }}
                >
                  IMG
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Type Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, i) => (
                  <TableRow key={row._id || i}>
                    <TableCell component="th" scope="row">
                      <span style={{ marginRight: 10, fontWeight: "bold" }}>
                        {page * rowsPerPage + (i + 1)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {row?.type_info?.type_img && (
                        <img
                          src={`${BaseAppUrl}/${row.type_info.type_img}`}
                          alt="type"
                          width={60}
                          height={60}
                          style={{ borderRadius: 6 }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {row?.type_info?.type_name}
                    </TableCell>
                    <TableCell align="center">
                      <DeleteIcon
                        sx={{ ...iconBorder, color: "#af1a1a" }}
                        onClick={() => handleDeleteItem(row._id, row)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20]}
                  colSpan={3}
                  count={rows?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </TableContainer>
    </Paper>
  );
}

// Pagination Actions Component
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => onPageChange(event, 0);
  const handleBackButtonClick = (event) => onPageChange(event, page - 1);
  const handleNextButtonClick = (event) => onPageChange(event, page + 1);
  const handleLastPageButtonClick = (event) =>
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
