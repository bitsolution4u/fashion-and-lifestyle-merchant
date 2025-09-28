// ** React Imports
import { useState, useEffect } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import ToggleButton from '@mui/material/ToggleButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Third Party Components

// ** Hooks
//import useClipboard from 'src/@core/hooks/useClipboard';

const CardSnippet = (props) => {
  // ** Props
  const { id, sx, code, title, children, className } = props;

  // ** States
  const [showCode, setShowCode] = useState(false);
  const [tabValue, setTabValue] = useState(code.tsx !== null ? 'tsx' : 'jsx');

  // ** Hooks
  //const clipboard = useClipboard();

  // ** Highlight code on mount

  const codeToCopy = () => {
    if (code.tsx !== null && tabValue === 'tsx') {
      return code.tsx.props.children.props.children;
    } else if (code.jsx !== null && tabValue === 'jsx') {
      return code.jsx.props.children.props.children;
    } else {
      return '';
    }
  };

  const renderCode = () => {
    if (code[tabValue] !== null) {
      return code[tabValue];
    } else {
      return null;
    }
  };

  return (
    <Card
      className={className}
      sx={{ '& .MuiCardHeader-action': { lineHeight: 0.8 }, ...sx }}
      id={id || `card-snippet--${title.toLowerCase().replace(/ /g, '-')}`}
    >
      <CardHeader
        title={title}
        action={
          <IconButton onClick={() => setShowCode(!showCode)}>
            <Icon icon="tabler:code" fontSize={20} />
          </IconButton>
        }
      />
      <CardContent>{children}</CardContent>
      <Collapse in={showCode}>
        <Divider sx={{ my: '0 !important' }} />

        <CardContent
          sx={{
            position: 'relative',
            '& pre': { m: '0 !important', maxHeight: 500 },
          }}
        >
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <ToggleButtonGroup
              exclusive
              size="small"
              color="primary"
              value={tabValue}
              onChange={(e, newValue) =>
                newValue !== null ? setTabValue(newValue) : null
              }
            >
              {code.tsx !== null ? (
                <ToggleButton value="tsx">
                  <Icon icon="tabler:brand-typescript" fontSize={20} />
                </ToggleButton>
              ) : null}
              {code.jsx !== null ? (
                <ToggleButton value="jsx">
                  <Icon icon="tabler:brand-javascript" fontSize={20} />
                </ToggleButton>
              ) : null}
            </ToggleButtonGroup>
          </Box>

          <div>{renderCode()}</div>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default CardSnippet;
