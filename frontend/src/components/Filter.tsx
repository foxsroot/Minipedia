// components/Filter.tsx
import React from "react";
import { Box, TextField, Button } from "@mui/material";

interface FilterProps {
  onFilterChange?: (filterText: string) => void;
  onApply?: () => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange, onApply }) => {
  const [input, setInput] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (onFilterChange) onFilterChange(e.target.value);
  };

  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        gap: 2,
        alignItems: "center",
        maxWidth: 500,
      }}
    >
      <TextField
        label="Search items"
        variant="outlined"
        size="small"
        fullWidth
        value={input}
        onChange={handleChange}
      />
      <Button variant="contained" onClick={onApply}>
        Apply
      </Button>
    </Box>
  );
};

export default Filter;
