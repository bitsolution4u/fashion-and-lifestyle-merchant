import { forwardRef } from 'react';
import MuiAvatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';

// eslint-disable-next-line react/display-name
const Avatar = forwardRef((props, ref) => {
  const { sx, skin, color } = props;
  const theme = useTheme();

  const getAvatarStyles = (skin, skinColor) => {
    let avatarStyles;
    if (skin === 'light') {
      avatarStyles = { backgroundColor: theme.palette[skinColor].main };
    } else if (skin === 'light-static') {
      avatarStyles = {
        color: theme.palette[skinColor].main,
        backgroundColor: theme.palette.background.default,
      };
    } else {
      avatarStyles = { backgroundColor: theme.palette[skinColor].main };
    }
    return avatarStyles;
  };

  const colors = {
    primary: getAvatarStyles(skin, 'primary'),
    secondary: getAvatarStyles(skin, 'secondary'),
    success: getAvatarStyles(skin, 'success'),
    error: getAvatarStyles(skin, 'error'),
    warning: getAvatarStyles(skin, 'warning'),
    info: getAvatarStyles(skin, 'info'),
  };

  return (
    <MuiAvatar
      ref={ref}
      {...props}
      sx={sx ? { ...colors[color], ...sx } : colors[color]}
    />
  );
});

Avatar.defaultProps = {
  skin: 'filled',
  color: 'primary',
};

export default Avatar;
