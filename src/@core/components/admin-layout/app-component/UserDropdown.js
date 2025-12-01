// // ** React Imports
// import { useState, Fragment } from 'react';
// import { useSelector } from 'react-redux';
// // ** Next Import
// import { useRouter } from 'next/navigation';
// // ** MUI Imports
// import Box from '@mui/material/Box';
// import Menu from '@mui/material/Menu';
// import Badge from '@mui/material/Badge';
// import Avatar from '@mui/material/Avatar';
// import Divider from '@mui/material/Divider';
// import { styled } from '@mui/material/styles';
// import Typography from '@mui/material/Typography';
// import MenuItem from '@mui/material/MenuItem';
// import Icon from 'src/@core/components/icon';
// import userLogOut from '@/@core/hooks/logout';
// import { useAdmin } from '@/@core/hooks/fetch-data/admin/useAdmin';

// // ** Styled Components
// const BadgeContentSpan = styled('span')(({ theme }) => ({
//   width: 8,
//   height: 8,
//   borderRadius: '50%',
//   backgroundColor: theme.palette.success.main,
//   boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
// }));

// const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
//   '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
//     color: theme.palette.primary.main,
//   },
// }));

// const UserDropdown = (props) => {
//   const router = useRouter();
//   const { saveLoggedInUserInfo } = useAdmin();
//   const userData = useSelector((state) => state.user.loginUserInfo);

//   // console.log('from drop down', userData);
//   // ** Props
//   const { settings } = props;

//   // ** States
//   const [anchorEl, setAnchorEl] = useState(null);

//   // ** Hooks

//   // ** Vars
//   const { direction } = settings;

//   const handleDropdownOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleDropdownClose = (url) => {
//     setAnchorEl(null);
//   };

//   const styles = {
//     px: 2,
//     py: 0.75,
//     width: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     color: 'text.primary',
//     textDecoration: 'none',
//     '& svg': {
//       mr: 2.5,
//       fontSize: '1rem',
//       color: 'text.secondary',
//     },
//   };
//   return (
//     <Fragment>
//       <Badge
//         overlap="circular"
//         onClick={handleDropdownOpen}
//         sx={{ ml: 2, cursor: 'pointer' }}
//         badgeContent={<BadgeContentSpan />}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right',
//         }}
//       >
//         <Avatar
//           alt="John Doe"
//           src=""
//           onClick={handleDropdownOpen}
//           sx={{ width: 38, height: 38 }}
//         />
//       </Badge>
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={() => handleDropdownClose()}
//         sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.75 } }}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: direction === 'ltr' ? 'right' : 'left',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: direction === 'ltr' ? 'right' : 'left',
//         }}
//       >
//         <Box sx={{ py: 1.75, px: 6 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Badge
//               overlap="circular"
//               badgeContent={<BadgeContentSpan />}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'right',
//               }}
//             >
//               <Avatar
//                 alt={userData?.shopName}
//                 src="/images/avatars/1.png"
//                 sx={{ width: '2.5rem', height: '2.5rem' }}
//               />
//             </Badge>
//             <Box
//               sx={{
//                 display: 'flex',
//                 ml: 2.5,
//                 alignItems: 'flex-start',
//                 flexDirection: 'column',
//               }}
//             >
//               <Typography sx={{ fontWeight: 500 }}>
//                 {userData?.user_name}
//               </Typography>
//               <Typography variant="body2">Merchant</Typography>
//             </Box>
//           </Box>
//         </Box>
//         <Divider sx={{ my: (theme) => `${theme.spacing(2)} !important` }} />
//         <MenuItemStyled
//           sx={{ p: 0 }}
//           // onClick={() => handleDropdownClose('/pages/user-profile/profile')}
//         >
//           <Box sx={styles}>
//             <Icon icon="tabler:user-check" />
//             {userData?.shopName?.slice(0, 20)}
//           </Box>
//         </MenuItemStyled>
//         <MenuItemStyled
//           sx={{ p: 0 }}
//           // onClick={() => handleDropdownClose('/pages/user-profile/profile')}
//         >
//           <Box sx={styles}>
//            <Icon icon="tabler:map-pin" />
//             {userData?.shopAddress?.slice(0, 20)}
//           </Box>
//         </MenuItemStyled>

//         <Divider sx={{ my: (theme) => `${theme.spacing(2)} !important` }} />
//         <MenuItemStyled sx={{ p: 0 }}>
//           <Box
//             sx={styles}
//             onClick={() => {
//               saveLoggedInUserInfo([]);
//               userLogOut();
//             }}
//           >
//             <Icon icon="tabler:logout" />
//             Sign Out
//           </Box>
//         </MenuItemStyled>
//       </Menu>
//     </Fragment>
//   );
// };

// export default UserDropdown;

// ** React Imports
import { useState, Fragment } from "react";
import { useSelector } from "react-redux";
// ** Next Import
import { useRouter } from "next/navigation";
// ** MUI Imports
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Icon from "src/@core/components/icon";
import userLogOut from "@/@core/hooks/logout";
import { useAdmin } from "@/@core/hooks/fetch-data/admin/useAdmin";

// ** Styled Components
const BadgeContentSpan = styled("span")(({ theme }) => ({
  width: 10,
  height: 10,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    "& .MuiBox-root, & svg": {
      color: theme.palette.primary.main,
    },
  },
}));

const UserDropdown = ({ settings }) => {
  const router = useRouter();
  const { saveLoggedInUserInfo } = useAdmin();
  const userData = useSelector((state) => state.user.loginUserInfo);

  const { direction } = settings;

  // ** States
  const [anchorEl, setAnchorEl] = useState(null);

  // ** Handlers
  const handleDropdownOpen = (event) => setAnchorEl(event.currentTarget);
  const handleDropdownClose = () => setAnchorEl(null);

  const handleSignOut = () => {
    saveLoggedInUserInfo([]);
    userLogOut();
  };

  const menuItemStyles = {
    px: 2.5,
    py: 1,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    color: "text.primary",
    textDecoration: "none",
    cursor: "pointer",
    "& svg": { fontSize: "1rem", color: "text.secondary" },
  };

  return (
    <Fragment>
      <Badge
        overlap="circular"
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: "pointer" }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Avatar
          alt={userData?.contactPerson || "User"}
          src={userData?.avatar || "/images/avatars/1.png"}
          sx={{ width: 40, height: 40 }}
        />
      </Badge>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        sx={{
          "& .MuiMenu-paper": { width: 260, mt: 4, borderRadius: 3, p: 1 },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: direction === "ltr" ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: direction === "ltr" ? "right" : "left",
        }}
      >
        {/* User Info */}
        <Box
          sx={{ py: 2, px: 3, display: "flex", alignItems: "center", gap: 2 }}
        >
          <Badge
            overlap="circular"
            badgeContent={<BadgeContentSpan />}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Avatar
              alt={userData?.contactPerson || "User"}
              src={userData?.avatar || "/images/avatars/1.png"}
              sx={{ width: 50, height: 50 }}
            />
          </Badge>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.95rem",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {userData?.contactPerson || "Owner Name"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.8rem" }}
            >
              Merchant
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Shop Info */}
        <MenuItemStyled sx={{ px: 3 }}>
          <Box sx={menuItemStyles}>
            <Icon icon="tabler:user-check" />
            <Typography
              sx={{
                fontSize: "0.85rem",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {userData?.shopName || "Shop Name"}
            </Typography>
          </Box>
        </MenuItemStyled>

        <MenuItemStyled sx={{ px: 3 }}>
          <Box sx={menuItemStyles}>
            <Icon icon="tabler:map-pin" />
            <Typography
              sx={{
                fontSize: "0.85rem",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {userData?.shopAddress || "Shop Address"}
            </Typography>
          </Box>
        </MenuItemStyled>

        <Divider sx={{ my: 1 }} />

        {/* Sign Out */}
        <MenuItemStyled sx={{ px: 3 }} onClick={handleSignOut}>
          <Box sx={menuItemStyles}>
            <Icon icon="tabler:logout" />
            <Typography sx={{ fontSize: "0.85rem" }}>Sign Out</Typography>
          </Box>
        </MenuItemStyled>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;
