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
import DeleteIcon from "@mui/icons-material/Delete";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import SearchField from "@/@core/components/mui/search-field";
import axiosWithoutCredential from "@/configs/axios/axiosWithoutCredential";
import { toast } from "react-toastify";
import { BaseAppUrl } from "@/@core/utlis/secretVariable";
import TableLoader from "@/@core/components/loader/table-loader";

export default function SubCategoryInfoTable({
  handleOpenModal,
  shop_id,
  refreshKey,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [subCategoryInfo, setSubCategoryInfo] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => setRows(subCategoryInfo), [subCategoryInfo]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getAllSubCategoryInfo = async () => {
    if (!shop_id) return;
    setLoading(true);
    try {
      const res = await axiosWithoutCredential.get(
        `/api/v1/sub-category/all-subcat-by-store/${shop_id}`
      );
      setLoading(false);
      setSubCategoryInfo(res.data?.data || []);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  // fetch on mount and when refreshKey changes
  React.useEffect(() => {
    getAllSubCategoryInfo();
  }, [shop_id, refreshKey]);

  const timerRef = React.useRef(null);
  const searchItem = (text) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const searchText = text.trim().toLowerCase();
      const filtered = searchText
        ? subCategoryInfo.filter((info) =>
            info?.sub_category_info?.sub_category_name
              ?.toLowerCase()
              .includes(searchText)
          )
        : subCategoryInfo;
      setRows(filtered);
      setPage(0);
    }, 500);
  };

  const handleDeleteItem = async (id) => {
    try {
      await axiosWithoutCredential.delete(
        `/api/v1/sub-category/delete-subcat-to-store/${id}`
      );
      toast.success("Sub Category successfully deleted from store!", {
        position: "top-center",
      });
      setRows((prev) => prev.filter((r) => r._id !== id));
      setSubCategoryInfo((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Paper
      sx={{ width: "100%", overflow: "hidden", position: "relative", mb: 2 }}
    >
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography color="primary">All Sub Category Information</Typography>
        <Button
          variant="outlined"
          sx={{
            "&:hover": { backgroundColor: "primary.main", color: grey[300] },
          }}
          onClick={() => handleOpenModal("add-subcategory")}
        >
          Assign Subcat
        </Button>
      </Box>

      <Box sx={{ pr: 2, pb: 3, display: "flex", justifyContent: "flex-end" }}>
        <SearchField onInputText={searchItem} />
      </Box>

      <TableContainer component={Paper}>
        {!loading ? (
          <TableLoader />
        ) : (
          <Table sx={{ minWidth: 300 }} aria-label="sub-category table">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>IMG</TableCell>
                <TableCell>Subcategory Name</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, i) => (
                  <TableRow key={row._id || i}>
                    <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                    <TableCell>
                      {row?.sub_category_info?.banner_type_1 && (
                        <img
                          src={`${BaseAppUrl}/${row.sub_category_info.banner_type_1}`}
                          alt="banner"
                          width={60}
                          height={60}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {row?.sub_category_info?.sub_category_name}
                    </TableCell>
                    <TableCell align="center">
                      <DeleteIcon
                        sx={{ ...iconBorder, color: "#af1a1a" }}
                        onClick={() => handleDeleteItem(row._id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20]}
                  colSpan={4}
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
