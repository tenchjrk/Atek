import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Alert, IconButton } from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { AxiosError } from 'axios';
import { vendorRegionApi, vendorSegmentApi } from '../services/api';
import type { VendorRegion, VendorSegment } from '../types';
import PageHeader from '../components/PageHeader';
import EntityList from '../components/EntityList';
import VendorRegionCreateDialog from '../components/VendorRegionCreateDialog';
import VendorRegionEditDialog from '../components/VendorRegionEditDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDateShort } from '../utils/dateFormatter';

export default function VendorRegions() {
  const { vendorId, segmentId } = useParams<{ vendorId: string; segmentId: string }>();
  const navigate = useNavigate();
  const [segment, setSegment] = useState<VendorSegment | null>(null);
  const [regions, setRegions] = useState<VendorRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<VendorRegion | null>(null);
  const [deletingRegionId, setDeletingRegionId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!segmentId) return;
    
    try {
      setLoading(true);
      const [segmentResponse, regionsResponse] = await Promise.all([
        vendorSegmentApi.getById(parseInt(segmentId)),
        vendorRegionApi.getBySegmentId(parseInt(segmentId)),
      ]);
      
      setSegment(segmentResponse.data);
      setRegions(regionsResponse.data);
      setError(null);
    } catch (err) {
      setError('Error loading data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [segmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (regionData: { vendorSegmentId: number; name: string }) => {
    try {
      await vendorRegionApi.create(regionData as Omit<VendorRegion, 'id'>);
      await fetchData();
      return true;
    } catch (err) {
      console.error('Error creating region:', err);
      return false;
    }
  };

  const handleEdit = (region: VendorRegion) => {
    setEditingRegion(region);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (regionData: { id: number; vendorSegmentId: number; name: string }) => {
    try {
      await vendorRegionApi.update(regionData.id, regionData as VendorRegion);
      await fetchData();
      return true;
    } catch (err) {
      console.error('Error updating region:', err);
      return false;
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingRegionId(id);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingRegionId !== null) {
      try {
        await vendorRegionApi.delete(deletingRegionId);
        await fetchData();
        setDeleteDialogOpen(false);
        setDeletingRegionId(null);
        setDeleteError(null);
      } catch (err) {
        let errorMessage = 'Error deleting region';
        if (err instanceof AxiosError && err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        setDeleteError(errorMessage);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingRegionId(null);
    setDeleteError(null);
  };

  const getDeletingRegionName = () => {
    const region = regions.find(r => r.id === deletingRegionId);
    return region?.name || 'this region';
  };

  const renderRegionSecondary = (region: VendorRegion) => {
    return (
      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
        ID: {region.id} • Created: {formatDateShort(region.createdDate)} • Modified: {formatDateShort(region.lastModifiedDate)}
      </Box>
    );
  };

  if (!vendorId || !segmentId) {
    return <Box>Invalid vendor or segment ID</Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(`/vendors/${vendorId}/segments`)} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <PageHeader
            title={`Regions in ${segment?.name || 'Segment'}`}
            subtitle="Manage regional divisions within this segment"
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Region
        </Button>
      </Box>

      <EntityList
        title="Regions"
        items={regions}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage="No regions yet. Add regions to organize this segment geographically."
        renderSecondary={renderRegionSecondary}
        customActions={(region) => (
          <Button
            size='small'
            variant='outlined'
            onClick={() => navigate(`/vendors/${vendorId}/segments/${segmentId}/regions/${region.id}/territories`)}
          >
            View Territories
          </Button>
        )}
      />

      <VendorRegionCreateDialog
        open={createDialogOpen}
        segmentId={parseInt(segmentId)}
        segmentName={segment?.name || ''}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <VendorRegionEditDialog
        open={editDialogOpen}
        region={editingRegion}
        segmentName={segment?.name || ''}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Region"
        message={
          deleteError ? (
            <Box>
              <Alert severity="error" sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            </Box>
          ) : (
            `Are you sure you want to delete "${getDeletingRegionName()}"? This action cannot be undone.`
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