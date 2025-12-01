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
} from "@mui/material";
import { grey } from "@mui/material/colors";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchField from "@/@core/components/mui/search-field";
import { BaseAppUrl } from "@/@core/utlis/secretVariable";
import axiosWithoutCredential from "@/configs/axios/axiosWithoutCredential";
import { toast } from "react-toastify";
import TableLoader from "@/@core/components/loader/table-loader";

export default function CategoryInfoTable({
  handleOpenModal,
  shop_id,
  refreshKey,
}) {
  const [categoryInfo, setCategoryInfo] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  // Ensure client-only rendering
  React.useEffect(() => setMounted(true), []);

  // Fetch category data
  const getAllCategoryInfo = async () => {
    if (!shop_id) return;
    setLoading(true);
    try {
      const result = await axiosWithoutCredential.get(
        `/api/v1/category/all-category-by-store/${shop_id}`
      );
      setLoading(false);
      setCategoryInfo(result?.data?.data || []);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  // Fetch on mount and refreshKey changes
  React.useEffect(() => {
    getAllCategoryInfo();
  }, [shop_id, refreshKey]);

  // Sync rows with categoryInfo
  React.useEffect(() => {
    setRows(categoryInfo);
  }, [categoryInfo]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const timerRef = React.useRef(null);
  const searchItem = (text) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const searchText = text.trim();
      const searchResults =
        searchText.length > 0
          ? categoryInfo.filter((info) =>
              info?.category_info?.category_name
                ?.toLowerCase()
                .includes(searchText.toLowerCase())
            )
          : categoryInfo;
      setRows(searchResults);
      setPage(0);
    }, 500);
  };

  const handleDeleteItem = async (id, item) => {
    try {
      await axiosWithoutCredential.put(`/api/v1/category/delete/${id}`, item);
      toast.success("Category successfully deleted!", {
        position: "top-center",
      });
      setRows((prev) => prev.filter((r) => r._id !== id));
      setCategoryInfo((prev) => prev.filter((r) => r._id !== id));
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
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography color="primary">All Category Information</Typography>
        <Button
          variant="outlined"
          sx={{
            "&:hover": { backgroundColor: "primary.main", color: grey[300] },
          }}
          onClick={() => handleOpenModal("add-category")}
        >
          Assign Category
        </Button>
      </Box>
      <Box sx={{ pr: 2, pb: 3, display: "flex", justifyContent: "flex-end" }}>
        <SearchField onInputText={searchItem} />
      </Box>

      <TableContainer component={Paper}>
        {!loading ? (
          <TableLoader />
        ) : (
          <Table sx={{ minWidth: 300 }} aria-label="category table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>No.</TableCell>
                <TableCell
                  sx={{ fontWeight: 600, textAlign: "left", minWidth: 100 }}
                >
                  IMG
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Category Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => (
                  <TableRow key={row._id || i}>
                    <TableCell component="th" scope="row">
                      <span style={{ marginRight: 10, fontWeight: "bold" }}>
                        {page * rowsPerPage + i + 1}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {row?.category_info?.icon && (
                          <img
                            src={`${BaseAppUrl}/${row.category_info.icon}`}
                            alt="icon"
                            width={60}
                            height={60}
                            style={{ borderRadius: 6 }}
                          />
                        )}
                        {row?.category_info?.banner && (
                          <img
                            src={`${BaseAppUrl}/${row.category_info.banner}`}
                            alt="banner"
                            width={60}
                            height={60}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {row?.category_info?.category_name}
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
                  rowsPerPageOptions={[10, 20]}
                  colSpan={4}
                  count={rows.length}
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
