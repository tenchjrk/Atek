import { Typography, Box, Card, CardContent } from "@mui/material";
import Grid from '@mui/material/Grid';
import { Business, Store } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Box>
      <Typography variant='h3' component='h1' gutterBottom>
        Welcome to Atek Data Solutions
      </Typography>
      <Typography variant='h6' color='text.secondary' paragraph>
        Your Contract Management Platform for managing accounts, vendors, and business relationships
      </Typography>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            component={Link}
            to='/accounts'
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
                <Business
                  sx={{ fontSize: 40, mr: 2, color: "primary.main" }}
                />
                <Typography variant='h5' component='div' sx={{ color: 'text.primary' }}>
                  Accounts
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary'>
                Manage your business customer accounts and track their information
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
                Manage your supplier and vendor relationships and partnerships
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}