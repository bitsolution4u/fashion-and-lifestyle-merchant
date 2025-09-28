import MuiChip from '@mui/material/Chip';
import clsx from 'clsx';

const Chip = (props) => {
  const { sx, skin, color, rounded } = props;

  const colors = {
    primary: { backgroundColor: '#E8F0FE' },
    secondary: { backgroundColor: '#F6F7FB' },
    success: { backgroundColor: '#E9F7EF' },
    error: { backgroundColor: '#FEF2F2' },
    warning: { backgroundColor: '#FFF5DB' },
    info: { backgroundColor: '#F0F5FF' },
  };

  const propsToPass = { ...props };
  propsToPass.rounded = undefined;

  return (
    <MuiChip
      {...propsToPass}
      variant="filled"
      className={clsx({
        'MuiChip-rounded': rounded,
        'MuiChip-light': skin === 'light',
      })}
      sx={skin === 'light' && color ? { ...colors[color], ...sx } : sx}
    />
  );
};

export default Chip;
