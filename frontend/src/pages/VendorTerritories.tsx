import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, IconButton } from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { vendorTerritoryApi, vendorRegionApi } from '../services/api';
import type { VendorTerritory, VendorRegion } from '../types';
import PageHeader from '../components/PageHeader';
import EntityList from '../components/EntityList';
import VendorTerritoryCreateDialog from '../components/VendorTerritoryCreateDialog';
import VendorTerritoryEditDialog from '../components/VendorTerritoryEditDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDateShort } from '../utils/dateFormatter';

export default function VendorTerritories() {
  const { vendorId, segmentId, regionId } = useParams<{ vendorId: string; segmentId: string; regionId: string }>();
  const navigate = useNavigate();
  const [region, setRegion] = useState<VendorRegion | null>(null);
  const [territories, setTerritories] = useState<VendorTerritory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTerritory, setEditingTerritory] = useState<VendorTerritory | null>(null);
  const [deletingTerritoryId, setDeletingTerritoryId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    if (!regionId) return;
    
    try {
      setLoading(true);
      const [regionResponse, territoriesResponse] = await Promise.all([
        vendorRegionApi.getById(parseInt(regionId)),
        vendorTerritoryApi.getByRegionId(parseInt(regionId)),
      ]);
      
      setRegion(regionResponse.data);
      setTerritories(territoriesResponse.data);
      setError(null);
    } catch (err) {
      setError('Error loading data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [regionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (territoryData: { vendorRegionId: number; name: string }) => {
    try {
      await vendorTerritoryApi.create(territoryData as Omit<VendorTerritory, 'id'>);
      await fetchData();
      return true;
    } catch (err) {
      console.error('Error creating territory:', err);
      return false;
    }
  };

  const handleEdit = (territory: VendorTerritory) => {
    setEditingTerritory(territory);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (territoryData: { id: number; vendorRegionId: number; name: string }) => {
    try {
      await vendorTerritoryApi.update(territoryData.id, territoryData as VendorTerritory);
      await fetchData();
      return true;
    } catch (err) {
      console.error('Error updating territory:', err);
      return false;
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingTerritoryId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingTerritoryId !== null) {
      try {
        await vendorTerritoryApi.delete(deletingTerritoryId);
        await fetchData();
        setDeleteDialogOpen(false);
        setDeletingTerritoryId(null);
      } catch (err) {
        console.error('Error deleting territory:', err);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingTerritoryId(null);
  };

  const getDeletingTerritoryName = () => {
    const territory = territories.find(t => t.id === deletingTerritoryId);
    return territory?.name || 'this territory';
  };

  const renderTerritorySecondary = (territory: VendorTerritory) => {
    return (
      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
        ID: {territory.id} • Created: {formatDateShort(territory.createdDate)} • Modified: {formatDateShort(territory.lastModifiedDate)}
      </Box>
    );
  };

  if (!vendorId || !segmentId || !regionId) {
    return <Box>Invalid vendor, segment, or region ID</Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(`/vendors/${vendorId}/segments/${segmentId}/regions`)} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <PageHeader
            title={`Territories in ${region?.name || 'Region'}`}
            subtitle="Manage specific sales territories within this region"
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Territory
        </Button>
      </Box>

      <EntityList
        title="Territories"
        items={territories}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage="No territories yet. Add territories to organize this region into specific sales areas."
        renderSecondary={renderTerritorySecondary}
      />

      <VendorTerritoryCreateDialog
        open={createDialogOpen}
        regionId={parseInt(regionId)}
        regionName={region?.name || ''}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <VendorTerritoryEditDialog
        open={editDialogOpen}
        territory={editingTerritory}
        regionName={region?.name || ''}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Territory"
        message={`Are you sure you want to delete "${getDeletingTerritoryName()}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}