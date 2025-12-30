import { useState, useEffect } from "react";
import { Box, Chip, Stack, Button, Alert } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { vendorApi, vendorTypeApi } from "../services/api";
import { useCrud } from "../hooks/useCrud";
import { useVendorFilters } from "../hooks/useVendorFilters";
import { useSortSimple } from "../hooks/useSortSimple";
import type { Vendor, VendorType } from "../types";
import PageHeader from "../components/PageHeader";
import EntityList from "../components/EntityList";
import VendorEditDialog from "../components/VendorEditDialog";
import VendorCreateDialog from "../components/VendorCreateDialog";
import VendorFilters from "../components/VendorFilters";
import SortControlsSimple from "../components/SortControlsSimple";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatDateShort } from "../utils/dateFormatter";

export default function Vendors() {
  const navigate = useNavigate();
  const { items, loading, error, createItem, updateItem, deleteItem } =
    useCrud<Vendor>(vendorApi);
  const [vendorTypes, setVendorTypes] = useState<VendorType[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deletingVendorId, setDeletingVendorId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
    vendorTypeFilter,
    setVendorTypeFilter,
    filteredVendors,
    activeFilterCount,
    clearFilters,
  } = useVendorFilters(items);

  // Apply sorting to filtered vendors
  const { sortedItems, sortField, sortOrder, handleSortChange } =
    useSortSimple(filteredVendors);

  // Fetch vendor types
  useEffect(() => {
    const fetchVendorTypes = async () => {
      try {
        const response = await vendorTypeApi.getAll();
        setVendorTypes(response.data);
      } catch (err) {
        console.error("Error loading vendor types:", err);
      }
    };
    fetchVendorTypes();
  }, []);

  const handleCreate = async (vendorData: {
    name: string;
    dunsNumber: string;
    ein: string;
    parentVendorId: number | null;
    vendorTypeId: number | null;
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
    dunsNumber: string;
    ein: string;
    parentVendorId: number | null;
    vendorTypeId: number | null;
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
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingVendorId !== null) {
      const result = await deleteItem(deletingVendorId);
      if (result.success) {
        setDeleteDialogOpen(false);
        setDeletingVendorId(null);
        setDeleteError(null);
      } else {
        setDeleteError(result.error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingVendorId(null);
    setDeleteError(null);
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
      <Stack spacing={0.5} sx={{ mt: 0.5 }} component='span'>
        <Box
          component='span'
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.875rem" }}>ID: {vendor.id}</span>
          {vendor.dunsNumber && (
            <span style={{ fontSize: "0.875rem" }}>
              • DUNS: {vendor.dunsNumber}
            </span>
          )}
          {vendor.ein && (
            <span style={{ fontSize: "0.875rem" }}>• EIN: {vendor.ein}</span>
          )}
          {vendor.vendorType && (
            <Chip
              label={vendor.vendorType.type}
              size='small'
              color='secondary'
              variant='outlined'
            />
          )}
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
          <Box
            component='span'
            sx={{
              fontSize: "0.875rem",
              color: "text.secondary",
              display: "block",
            }}
          >
            📍
            {addressLine1 && <span> {addressLine1}</span>}
            {addressLine2 && <span>, {addressLine2}</span>}
            {(addressLine1 || addressLine2) && cityStateZip && <span>,</span>}
            {cityStateZip && <span> {cityStateZip}</span>}
            {country && <span>, {country}</span>}
          </Box>
        )}
        <Box
          component='span'
          sx={{
            fontSize: "0.75rem",
            color: "text.secondary",
            display: "block",
          }}
        >
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
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant='outlined'
            onClick={() => navigate("/vendor-types")}
            sx={{ mt: 1 }}
          >
            Manage Types
          </Button>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ mt: 1 }}
          >
            Add Vendor
          </Button>
        </Box>
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
        vendorTypeFilter={vendorTypeFilter}
        onVendorTypeFilterChange={setVendorTypeFilter}
        vendorTypes={vendorTypes}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      />

      <SortControlsSimple
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <EntityList
        title='Vendors'
        items={sortedItems}
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
        customActions={(vendor) => (
          <Button
            size='small'
            variant='outlined'
            onClick={() => navigate(`/vendors/${vendor.id}/segments`)}
          >
            Manage Segments
          </Button>
        )}
      />

      <VendorCreateDialog
        open={createDialogOpen}
        vendors={items}
        vendorTypes={vendorTypes}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <VendorEditDialog
        open={editDialogOpen}
        vendor={editingVendor}
        vendors={items}
        vendorTypes={vendorTypes}
        onClose={handleCloseEditDialog}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title='Delete Vendor'
        message={
          deleteError ? (
            <Box>
              <Alert severity='error' sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            </Box>
          ) : (
            `Are you sure you want to delete "${getDeletingVendorName()}"? This action cannot be undone.`
          )
        }
        confirmText={deleteError ? "OK" : "Delete"}
        cancelText={deleteError ? undefined : "Cancel"}
        confirmColor={deleteError ? "primary" : "error"}
        onConfirm={deleteError ? handleDeleteCancel : handleDeleteConfirm}
        onCancel={deleteError ? undefined : handleDeleteCancel}
      />
    </Box>
  );
}