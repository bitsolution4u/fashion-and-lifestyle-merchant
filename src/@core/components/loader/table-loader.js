import { Box, Skeleton } from "@mui/material";
import React from "react";

const TableLoader = () => {
  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {/* Header Skeleton */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Skeleton variant="text" width={150} height={30} />
        <Skeleton variant="rectangular" width={100} height={40} />
      </Box>

      {/* Rows Skeleton */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={80} height={15} />
            </Box>
          </Box>
          <Skeleton variant="text" width={60} height={20} />
        </Box>
      ))}
    </Box>
  );
};

export default TableLoader;
