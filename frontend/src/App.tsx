import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Accounts from "./pages/Accounts";
import Vendors from "./pages/Vendors";
import AccountTypes from "./pages/AccountTypes";
import VendorTypes from "./pages/VendorTypes";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2c4256",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path='accounts' element={<Accounts />} />
            <Route path='vendors' element={<Vendors />} />
            <Route path='account-types' element={<AccountTypes />} />
            <Route path='vendor-types' element={<VendorTypes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
