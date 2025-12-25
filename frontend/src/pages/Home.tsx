import { Typography, Box, Card, CardContent } from "@mui/material";
// We import Grid2 specifically to resolve the type mismatch
import Grid from '@mui/material/Grid';
import { AccountBox, Store } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Box>
      <Typography variant='h3' component='h1' gutterBottom>
        Welcome to Atek
      </Typography>
      <Typography variant='h6' color='text.secondary' paragraph>
        Your SaaS platform for managing accounts and vendors
      </Typography>

      {/* In Grid2, "container" is still used, but "item" is removed */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        
        {/* We use size={{ xs: 12, md: 6 }} instead of separate props */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            component={Link}
            to='/accounts'
            sx={{
              display: 'block', // Ensures the link occupies the full card area
              textDecoration: "none",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AccountBox
                  sx={{ fontSize: 40, mr: 2, color: "primary.main" }}
                />
                <Typography variant='h5' component='div' sx={{ color: 'text.primary' }}>
                  Accounts
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary'>
                Manage your customer accounts and track their information
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            component={Link}
            to='/vendors'
            sx={{
              display: 'block',
              textDecoration: "none",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Store sx={{ fontSize: 40, mr: 2, color: "primary.main" }} />
                <Typography variant='h5' component='div' sx={{ color: 'text.primary' }}>
                  Vendors
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary'>
                Manage your vendor relationships and partnerships
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}