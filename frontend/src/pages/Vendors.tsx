import { useState } from "react";
import { Box, Chip, Stack, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { vendorApi } from "../services/api";
import { useCrud } from "../hooks/useCrud";
import { useVendorFilters } from "../hooks/useVendorFilters";
import type { Vendor } from "../types";
import PageHeader from "../components/PageHeader";
import EntityList from "../components/EntityList";
import VendorEditDialog from "../components/VendorEditDialog";
import VendorCreateDialog from "../components/VendorCreateDialog";
import VendorFilters from "../components/VendorFilters";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatDateShort } from "../utils/dateFormatter";

export default function Vendors() {
  const { items, loading, error, createItem, updateItem, deleteItem } =
    useCrud<Vendor>(vendorApi);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deletingVendorId, setDeletingVendorId] = useState<number | null>(null);

  const {
    searchTerm,
    setSearchTerm,
    cityFilter,
    setCityFilter,
    stateFilter,
    setStateFilter,
    postalCodeFilter,
    setPostalCodeFilter,
    countryFilter,
    setCountryFilter,
    filteredVendors,
    activeFilterCount,
    clearFilters,
  } = useVendorFilters(items);

  const handleCreate = async (vendorData: {
    name: string;
    parentVendorId: number | null;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    const success = await createItem(vendorData as Omit<Vendor, "id">);
    return success;
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (vendorData: {
    id: number;
    name: string;
    parentVendorId: number | null;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    return await updateItem(vendorData.id, vendorData as Vendor);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingVendorId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingVendorId !== null) {
      await deleteItem(deletingVendorId);
      setDeleteDialogOpen(false);
      setDeletingVendorId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingVendorId(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingVendor(null);
  };

  const getDeletingVendorName = () => {
    const vendor = items.find((v) => v.id === deletingVendorId);
    return vendor?.name || "this vendor";
  };

  const renderVendorSecondary = (vendor: Vendor) => {
    const addressLine1 = vendor.addressLine1;
    const addressLine2 = vendor.addressLine2;
    const cityStateZip = [vendor.city, vendor.state, vendor.postalCode]
      .filter(Boolean)
      .join(", ");
    const country = vendor.country;

    const hasAddress = addressLine1 || addressLine2 || cityStateZip || country;

    return (
      <Stack spacing={0.5} sx={{ mt: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.875rem" }}>ID: {vendor.id}</span>
          {vendor.parentVendor && (
            <Chip
              label={`Child of: ${vendor.parentVendor.name}`}
              size='small'
              color='primary'
              variant='outlined'
            />
          )}
        </Box>
        {hasAddress && (
          <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
            📍
            {addressLine1 && <span> {addressLine1}</span>}
            {addressLine2 && <span>, {addressLine2}</span>}
            {(addressLine1 || addressLine2) && cityStateZip && <span>,</span>}
            {cityStateZip && <span> {cityStateZip}</span>}
            {country && <span>, {country}</span>}
          </Box>
        )}
        <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
          Created: {formatDateShort(vendor.createdDate)} • Modified:{" "}
          {formatDateShort(vendor.lastModifiedDate)}
        </Box>
      </Stack>
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <PageHeader
          title='Vendor Management'
          subtitle='Manage your supplier and vendor relationships'
        />
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Vendor
        </Button>
      </Box>

      <VendorFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cityFilter={cityFilter}
        onCityFilterChange={setCityFilter}
        stateFilter={stateFilter}
        onStateFilterChange={setStateFilter}
        postalCodeFilter={postalCodeFilter}
        onPostalCodeFilterChange={setPostalCodeFilter}
        countryFilter={countryFilter}
        onCountryFilterChange={setCountryFilter}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      />

      <EntityList
        title='Vendors'
        items={filteredVendors}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage={
          activeFilterCount > 0 || searchTerm
            ? "No vendors match your search or filters."
            : "No vendors yet. Create your first vendor above."
        }
        renderSecondary={renderVendorSecondary}
      />

      <VendorCreateDialog
        open={createDialogOpen}
        vendors={items}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <VendorEditDialog
        open={editDialogOpen}
        vendor={editingVendor}
        vendors={items}
        onClose={handleCloseEditDialog}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title='Delete Vendor'
        message={`Are you sure you want to delete "${getDeletingVendorName()}"? This action cannot be undone.`}
        confirmText='Delete'
        cancelText='Cancel'
        confirmColor='error'
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}
