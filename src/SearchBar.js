import * as React from "react";
import {alpha, styled} from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const Search = styled("div")(({theme}) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  [theme.palette.mode !== "dark"]: {},
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    opacity: 0.8,
  },
  transition: "opacity 0.25s",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
    maxWidth: "none",
  },
}));

const SearchIconWrapper = styled("div")(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ClearIconWrapper = styled("div")(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  right: 0,
  top: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
  color: "inherit",
  width: '100%',
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
  },
}));

const SearchBar = ({sx, style, value, setValue, onChange, ...props}) => {
  const handleClear = () => {
    setValue('')
  }

  return (
    <Search sx={sx} style={style}>
      <SearchIconWrapper>
        <SearchIcon/>
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{"aria-label": "search"}}
        value={value}
        onChange={onChange}
      />
      <ClearIconWrapper onClick={handleClear} sx={{display: value.length > 0 ? 'flex': 'none'}}>
        <ClearIcon color={"action"} fontSize={"small"}/>
      </ClearIconWrapper>
    </Search>
  );
};

export default SearchBar;
