import { Typography, Paper, Box } from '@mui/material';

export default function Vendors() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Vendor Management
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Vendor functionality coming soon...
        </Typography>
      </Paper>
    </Box>
  );
}