import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchField(props) {
    const [searchFieldValue, setSearchFieldValue] = React.useState('');
    const [isFocused, setIsFocused] = React.useState(false);

    const inputTimer = React.useRef(null);

    const handleSearchInput = (e) => {
        let text = e.target.value;
        console.log(e.target.value);
        props.onInputText(e.target.value);
        setSearchFieldValue(e.target.value);

        if (inputTimer.current) clearTimeout(inputTimer.current);
        inputTimer.current = setTimeout(() => {
            const searchText = text.trim();
            if (searchText < 1) {
                setIsFocused(false);
            }
        }, 1000);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const inputBaseStyle = {
        ml: 1,
        flex: 1,
        // backgroundColor: '#b7b5b542',
        transition: 'width 0.3s ease-in-out',
        width: isFocused || searchFieldValue.length > 0 ? '500px' : '450px', // Adjust the width here
        color: '#000',
        fontSize: '18px',
    };

    return (
        <Paper
            component="form"
            sx={{
                p: '0px 4px',
                display: 'flex',
                backgroundColor: '#b7b5b542',
                alignItems: 'center',
                transition: 'width 0.3s ease-in-out',
                width: isFocused || searchFieldValue.length > 0 ? '500px' : '450px', // Adjust the width here
            }}
        >
            <IconButton type="button" sx={{ p: '8px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
            <InputBase
                sx={inputBaseStyle}
                placeholder="Search..."
                inputProps={{ 'aria-label': 'Search...' }}
                onChange={(e) => handleSearchInput(e)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={searchFieldValue}
            />
        </Paper>
    );
}
