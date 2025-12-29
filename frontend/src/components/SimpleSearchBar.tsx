import { TextField, Box } from '@mui/material';

interface SimpleSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export default function SimpleSearchBar({
  searchTerm,
  onSearchChange,
  placeholder = "Search by name...",
}: SimpleSearchBarProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        variant="outlined"
        size="medium"
      />
    </Box>
  );
}