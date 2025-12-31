import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import Vendors from './pages/Vendors';
import AccountTypes from './pages/AccountTypes';
import VendorTypes from './pages/VendorTypes';
import AccountAddresses from './pages/AccountAddresses';
import VendorSegments from './pages/VendorSegments';
import VendorRegions from './pages/VendorRegions';
import VendorTerritories from './pages/VendorTerritories';
import ItemCategories from './pages/ItemCategories';
import Items from './pages/Items';
import UnitOfMeasures from './pages/UnitOfMeasures';
import ItemTypes from './pages/ItemTypes';
import AllItems from './pages/AllItems';
import ContractStatuses from './pages/ContractStatuses';
import ContractTypes from './pages/ContractTypes';
import Contracts from './pages/Contracts';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c4256',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="contracts" element={<Contracts />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="accounts/:accountId/addresses" element={<AccountAddresses />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="vendors/:vendorId/segments" element={<VendorSegments />} />
            <Route path="vendors/:vendorId/segments/:segmentId/regions" element={<VendorRegions />} />
            <Route path="vendors/:vendorId/segments/:segmentId/regions/:regionId/territories" element={<VendorTerritories />} />
            <Route path="vendors/:vendorId/segments/:segmentId/categories" element={<ItemCategories />} />
            <Route path="vendors/:vendorId/segments/:segmentId/categories/:categoryId/items" element={<Items />} />
            <Route path="all-items" element={<AllItems />} />
            <Route path="account-types" element={<AccountTypes />} />
            <Route path="vendor-types" element={<VendorTypes />} />
            <Route path="unit-of-measures" element={<UnitOfMeasures />} />
            <Route path="item-types" element={<ItemTypes />} />
            <Route path="contract-statuses" element={<ContractStatuses />} />
            <Route path="contract-types" element={<ContractTypes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;