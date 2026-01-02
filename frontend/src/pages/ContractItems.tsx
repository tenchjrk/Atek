import { useState, useEffect } from "react";
import { Box, Button, Chip, Alert, CircularProgress, Typography } from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import {
  contractItemApi,
  contractApi,
  itemApi,
  itemCategoryApi,
  vendorSegmentApi,
  itemTypeApi,
} from "../services/api";
import type {
  Contract,
  Item,
  ItemCategory,
  VendorSegment,
  ContractItem,
  ItemType,
} from "../types";
import { useContractItemBulkEdit } from "../hooks/useContractItemBulkEdit";
import PageHeader from "../components/PageHeader";
import SegmentAccordion from "../components/SegmentAccordion";

export default function ContractItems() {
  const navigate = useNavigate();
  const { contractId } = useParams<{ contractId: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [contractLoading, setContractLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [itemCategories, setItemCategories] = useState<ItemCategory[]>([]);
  const [vendorSegments, setVendorSegments] = useState<VendorSegment[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [existingContractItems, setExistingContractItems] = useState<ContractItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  // Fetch contract details and related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          contractResponse,
          contractItemsResponse,
          itemsResponse,
          categoriesResponse,
          segmentsResponse,
          itemTypesResponse,
        ] = await Promise.all([
          contractApi.getById(Number(contractId)),
          contractItemApi.getByContractId(Number(contractId)),
          itemApi.getAll(),
          itemCategoryApi.getAll(),
          vendorSegmentApi.getAll(),
          itemTypeApi.getAll(),
        ]);

        const contractData = contractResponse.data;
        setContract(contractData);
        setExistingContractItems(contractItemsResponse.data);

        // Filter items by vendor
        const allItems = itemsResponse.data;
        const vendorSegmentIds = segmentsResponse.data
          .filter((seg) => seg.vendorId === contractData.vendorId)
          .map((seg) => seg.id);

        const vendorCategories = categoriesResponse.data.filter((cat) =>
          vendorSegmentIds.includes(cat.vendorSegmentId)
        );

        const vendorCategoryIds = vendorCategories.map((cat) => cat.id);

        const vendorItems = allItems.filter((item) =>
          vendorCategoryIds.includes(item.itemCategoryId)
        );

        setItems(vendorItems);
        setItemCategories(vendorCategories);
        setVendorSegments(
          segmentsResponse.data.filter(
            (seg) => seg.vendorId === contractData.vendorId
          )
        );
        setItemTypes(itemTypesResponse.data);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setContractLoading(false);
      }
    };
    fetchData();
  }, [contractId]);

  // Use the bulk edit hook - resetTrigger forces reinitialization
  const {
    state,
    hasChanges,
    setSegmentPricing,
    setCategoryPricing,
    setItemPricing,
    toggleItem,
    toggleCategory,
    toggleSegment,
    setCategorySearch,
    getChanges,
  } = useContractItemBulkEdit(
    vendorSegments,
    itemCategories,
    items,
    existingContractItems,
    itemTypes,
    resetTrigger
  );

  // Hide saved indicator when changes are made
  useEffect(() => {
    if (hasChanges) {
      setShowSavedIndicator(false);
    }
  }, [hasChanges]);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');
    try {
      const { toCreate, toUpdate, toDelete } = getChanges();

      // Execute all changes
      const promises = [
        ...toCreate.map((data) =>
          contractItemApi.create({
            ...data,
            contractId: Number(contractId),
          } as Omit<ContractItem, "id">)
        ),
        ...toUpdate.map((data) =>
          contractItemApi.update(data.id, {
            ...data,
            contractId: Number(contractId),
          } as ContractItem)
        ),
        ...toDelete.map((id) => contractItemApi.delete(id)),
      ];

      await Promise.all(promises);

      // Refresh contract items
      const contractItemsResponse = await contractItemApi.getByContractId(
        Number(contractId)
      );
      setExistingContractItems(contractItemsResponse.data);

      setSaveStatus('success');
      setShowSavedIndicator(true);
      
      // Reset success status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (err) {
      console.error("Error saving changes:", err);
      setSaveStatus('error');
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    // Increment resetTrigger to force hook reinitialization
    setResetTrigger(prev => prev + 1);
  };

  // Determine button content based on state
  const getButtonContent = () => {
    if (saving) {
      return (
        <>
          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
          Saving...
        </>
      );
    }
    if (saveStatus === 'success') {
      return (
        <>
          <CheckIcon sx={{ mr: 1 }} />
          Saved
        </>
      );
    }
    if (saveStatus === 'error') {
      return (
        <>
          <ErrorIcon sx={{ mr: 1 }} />
          Error Saving
        </>
      );
    }
    return (
      <>
        <SaveIcon sx={{ mr: 1 }} />
        Save All Changes
      </>
    );
  };

  // Determine button color
  const getButtonColor = () => {
    if (saveStatus === 'success') return 'success';
    if (saveStatus === 'error') return 'error';
    return 'primary';
  };

  if (contractLoading) {
    return <Box sx={{ p: 3 }}>Loading contract...</Box>;
  }

  if (!contract) {
    return (
      <Alert severity="error">
        Contract not found.{" "}
        <Button onClick={() => navigate("/contracts")}>
          Back to Contracts
        </Button>
      </Alert>
    );
  }

  // Wait for state to be initialized
  if (vendorSegments.length > 0 && Object.keys(state.segments).length === 0) {
    return <Box sx={{ p: 3 }}>Initializing items...</Box>;
  }

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
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/contracts")}
            sx={{ mb: 2 }}
          >
            Back to Contracts
          </Button>
          <PageHeader
            title={`Item Pricing for Contract ${contract.id}: ${contract.name}`}
            subtitle={contract.description || undefined}
          />
          <Box sx={{ mt: 1 }}>
            <Chip
              label={contract.vendor?.name || "Unknown Vendor"}
              color="secondary"
              sx={{ mr: 1 }}
            />
            <Chip
              label={contract.account?.name || "Unknown Account"}
              color="info"
              sx={{ mr: 1 }}
            />
            <Chip
              label={contract.contractStatus?.name || "Unknown Status"}
              color="primary"
              sx={{ mr: 1 }}
            />
            {contract.termLengthMonths && (
              <Chip
                label={`${contract.termLengthMonths} ${contract.termLengthMonths === 1 ? 'Month' : 'Months'}`}
                variant="outlined"
              />
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          {showSavedIndicator && !hasChanges && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckIcon sx={{ color: 'success.main' }} />
              <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'medium' }}>
                Saved
              </Typography>
            </Box>
          )}
          {hasChanges && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<CloseIcon />}
              onClick={handleDiscardChanges}
              sx={{ minWidth: 160 }}
            >
              Discard Changes
            </Button>
          )}
          <Button
            variant="contained"
            color={getButtonColor()}
            onClick={handleSave}
            disabled={!hasChanges || saving}
            sx={{ minWidth: 180 }}
          >
            {getButtonContent()}
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        {vendorSegments.length === 0 ? (
          <Alert severity="info">
            No segments found for this vendor. Please add segments, categories,
            and items to this vendor first.
          </Alert>
        ) : (
          vendorSegments.map((segment) => {
            const segmentCategories = itemCategories.filter(
              (c) => c.vendorSegmentId === segment.id
            );
            const segmentState = state.segments[segment.id];

            // Safety check - skip if segment state not initialized yet
            if (!segmentState) return null;

            return (
              <SegmentAccordion
                key={segment.id}
                segment={segment}
                categories={segmentCategories}
                items={items}
                itemTypes={itemTypes}
                segmentState={segmentState}
                onToggleSegment={() => toggleSegment(segment.id)}
                onSegmentPricingChange={(itemTypeId, discount, rebate) =>
                  setSegmentPricing(segment.id, itemTypeId, discount, rebate)
                }
                onToggleCategory={(categoryId) =>
                  toggleCategory(segment.id, categoryId)
                }
                onCategoryPricingChange={(categoryId, itemTypeId, discount, rebate) =>
                  setCategoryPricing(segment.id, categoryId, itemTypeId, discount, rebate)
                }
                onToggleItem={(categoryId, itemId) =>
                  toggleItem(segment.id, categoryId, itemId)
                }
                onItemDiscountChange={(categoryId, itemId, value) =>
                  setItemPricing(
                    segment.id,
                    categoryId,
                    itemId,
                    value,
                    segmentState.categories[categoryId].items[itemId]
                      .rebatePercentage
                  )
                }
                onItemRebateChange={(categoryId, itemId, value) =>
                  setItemPricing(
                    segment.id,
                    categoryId,
                    itemId,
                    segmentState.categories[categoryId].items[itemId]
                      .discountPercentage,
                    value
                  )
                }
                onCategorySearchChange={(categoryId, value) =>
                  setCategorySearch(segment.id, categoryId, value)
                }
              />
            );
          })
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: 'center', gap: 2, mt: 3 }}>
        {showSavedIndicator && !hasChanges && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckIcon sx={{ color: 'success.main' }} />
            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'medium' }}>
              Saved
            </Typography>
          </Box>
        )}
        {hasChanges && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<CloseIcon />}
            onClick={handleDiscardChanges}
            sx={{ minWidth: 160 }}
          >
            Discard Changes
          </Button>
        )}
        <Button
          variant="contained"
          color={getButtonColor()}
          onClick={handleSave}
          disabled={!hasChanges || saving}
          sx={{ minWidth: 180 }}
        >
          {getButtonContent()}
        </Button>
      </Box>
    </Box>
  );
}