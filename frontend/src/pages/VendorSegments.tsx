import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Alert, IconButton } from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { AxiosError } from 'axios';
import { vendorSegmentApi, vendorApi } from '../services/api';
import { useSimpleSearch } from '../hooks/useSimpleSearch';
import { useSortSimple } from '../hooks/useSortSimple';
import type { VendorSegment, Vendor } from '../types';
import PageHeader from '../components/PageHeader';
import EntityList from '../components/EntityList';
import SimpleSearchBar from '../components/SimpleSearchBar';
import SortControlsSimple from '../components/SortControlsSimple';
import VendorSegmentCreateDialog from '../components/VendorSegmentCreateDialog';
import VendorSegmentEditDialog from '../components/VendorSegmentEditDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDateShort } from '../utils/dateFormatter';

export default function VendorSegments() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [segments, setSegments] = useState<VendorSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<VendorSegment | null>(null);
  const [deletingSegmentId, setDeletingSegmentId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Apply search
  const { searchTerm, setSearchTerm, filteredItems } = useSimpleSearch(segments);

  // Apply sorting to filtered segments
  const { sortedItems, sortField, sortOrder, handleSortChange } = useSortSimple(filteredItems);

  const fetchData = useCallback(async () => {
    if (!vendorId) return;
    
    try {
      setLoading(true);
      const [vendorResponse, segmentsResponse] = await Promise.all([
        vendorApi.getById(parseInt(vendorId)),
        vendorSegmentApi.getByVendorId(parseInt(vendorId)),
      ]);
      
      setVendor(vendorResponse.data);
      setSegments(segmentsResponse.data);
      setError(null);
    } catch (err) {
      setError('Error loading data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (segmentData: { vendorId: number; name: string }) => {
    try {
      await vendorSegmentApi.create(segmentData as Omit<VendorSegment, 'id'>);
      await fetchData();
      return true;
    } catch (err) {
      console.error('Error creating segment:', err);
      return false;
    }
  };

  const handleEdit = (segment: VendorSegment) => {
    setEditingSegment(segment);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (segmentData: { id: number; vendorId: number; name: string }) => {
    try {
      await vendorSegmentApi.update(segmentData.id, segmentData as VendorSegment);
      await fetchData();
      return true;
    } catch (err) {
      console.error('Error updating segment:', err);
      return false;
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingSegmentId(id);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingSegmentId !== null) {
      try {
        await vendorSegmentApi.delete(deletingSegmentId);
        await fetchData();
        setDeleteDialogOpen(false);
        setDeletingSegmentId(null);
        setDeleteError(null);
      } catch (err) {
        let errorMessage = 'Error deleting segment';
        if (err instanceof AxiosError && err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        setDeleteError(errorMessage);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingSegmentId(null);
    setDeleteError(null);
  };

  const getDeletingSegmentName = () => {
    const segment = segments.find(s => s.id === deletingSegmentId);
    return segment?.name || 'this segment';
  };

  const renderSegmentSecondary = (segment: VendorSegment) => {
    return (
      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
        ID: {segment.id} • Created: {formatDateShort(segment.createdDate)} • Modified: {formatDateShort(segment.lastModifiedDate)}
      </Box>
    );
  };

  if (!vendorId) {
    return <Box>Invalid vendor ID</Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/vendors')} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <PageHeader
            title={`Segments for ${vendor?.name || 'Vendor'}`}
            subtitle="Manage business line segments for this vendor"
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Segment
        </Button>
      </Box>

      <SimpleSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search segments by name..."
      />

      <SortControlsSimple
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <EntityList
        title="Segments"
        items={sortedItems}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage={
          searchTerm
            ? 'No segments match your search.'
            : 'No segments yet. Add segments to organize vendor business lines.'
        }
        renderSecondary={renderSegmentSecondary}
        customActions={(segment) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size='small'
              variant='outlined'
              onClick={() => navigate(`/vendors/${vendorId}/segments/${segment.id}/categories`)}
            >
              Manage Categories
            </Button>
            <Button
              size='small'
              variant='outlined'
              onClick={() => navigate(`/vendors/${vendorId}/segments/${segment.id}/regions`)}
            >
              View Regions
            </Button>
          </Box>
        )}
      />

      <VendorSegmentCreateDialog
        open={createDialogOpen}
        vendorId={parseInt(vendorId)}
        vendorName={vendor?.name || ''}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreate}
      />

      <VendorSegmentEditDialog
        open={editDialogOpen}
        segment={editingSegment}
        vendorName={vendor?.name || ''}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Segment"
        message={
          deleteError ? (
            <Box>
              <Alert severity="error" sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            </Box>
          ) : (
            `Are you sure you want to delete "${getDeletingSegmentName()}"? This action cannot be undone.`
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