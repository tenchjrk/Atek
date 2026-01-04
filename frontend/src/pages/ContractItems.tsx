import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
  Send as SendIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
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
  const [existingContractItems, setExistingContractItems] = useState<
    ContractItem[]
  >([]);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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

  // Calculate contract-level totals
  const calculateContractTotals = () => {
    let totalCost = 0;
    let monthlyTotalRevenue = 0;
    let monthlyNetRevenue = 0;

    Object.values(state.segments).forEach((segmentState) => {
      Object.values(segmentState.categories).forEach((categoryState) => {
        Object.entries(categoryState.items).forEach(
          ([itemIdStr, itemState]) => {
            if (itemState.selected) {
              const itemId = Number(itemIdStr);
              const item = items.find((i) => i.id === itemId);
              if (!item) return;

              const listPrice = item.listPrice || 0;
              const cost = item.cost || 0;
              const quantity = itemState.quantityCommitment
                ? parseFloat(itemState.quantityCommitment)
                : 1;

              // Calculate net price per unit
              const discountPercent = itemState.discountPercentage
                ? parseFloat(itemState.discountPercentage) / 100
                : 0;
              const priceAfterDiscount = listPrice * (1 - discountPercent);

              const rebatePercent = itemState.rebatePercentage
                ? parseFloat(itemState.rebatePercentage) / 100
                : 0;
              const priceAfterRebate = priceAfterDiscount * (1 - rebatePercent);

              const conditionalRebatePercent = itemState.conditionalRebate
                ? parseFloat(itemState.conditionalRebate) / 100
                : 0;
              const netPricePerUnit =
                priceAfterRebate * (1 - conditionalRebatePercent);

              // Monthly revenue (after discount, before rebates)
              monthlyTotalRevenue += priceAfterDiscount * quantity;

              // Monthly net revenue (after all rebates except growth)
              monthlyNetRevenue += netPricePerUnit * quantity;

              // Weight by quantity
              totalCost += cost * quantity;
            }
          }
        );
      });
    });

    const margin =
      monthlyNetRevenue === 0
        ? 0
        : ((monthlyNetRevenue - totalCost) / monthlyNetRevenue) * 100;

    return {
      margin,
      monthlyTotalRevenue,
      monthlyNetRevenue,
    };
  };

  const {
    margin: contractMargin,
    monthlyTotalRevenue: contractMonthlyTotal,
    monthlyNetRevenue: contractMonthlyNet,
  } = calculateContractTotals();

  // Format currency with commas
  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Get margin color based on value
  const getMarginColor = (margin: number) => {
    if (margin >= 80) return "success.main"; // Green
    if (margin >= 70) return "warning.main"; // Yellow
    return "error.main"; // Red
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");
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

      // If contract is "Margin Approved" (3), change back to "Draft" (1)
      if (contract?.contractStatusId === 3) {
        await contractApi.update(contract.id, {
          ...contract,
          contractStatusId: 1,
        });
        // Refresh contract data
        const contractResponse = await contractApi.getById(Number(contractId));
        setContract(contractResponse.data);
      }

      // Refresh contract items
      const contractItemsResponse = await contractItemApi.getByContractId(
        Number(contractId)
      );
      setExistingContractItems(contractItemsResponse.data);

      setSaveStatus("success");
      setShowSavedIndicator(true);

      // Reset success status after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (err) {
      console.error("Error saving changes:", err);
      setSaveStatus("error");

      // Reset error status after 5 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    // Increment resetTrigger to force hook reinitialization
    setResetTrigger((prev) => prev + 1);
  };

  const handleStatusChange = async (newStatusId: number) => {
    if (!contract) return;

    setUpdatingStatus(true);
    try {
      await contractApi.update(contract.id, {
        ...contract,
        contractStatusId: newStatusId,
      });

      // Refresh contract data
      const contractResponse = await contractApi.getById(Number(contractId));
      setContract(contractResponse.data);
    } catch (err) {
      console.error("Error updating contract status:", err);
      alert("Error updating contract status. Please try again.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendForApproval = () => {
    handleStatusChange(2); // Margin Approval
  };

  const handleApprove = () => {
    handleStatusChange(3); // Margin Approved
  };

  const handleReject = () => {
    handleStatusChange(4); // Pricing Needs Edited
  };

  // Determine which workflow buttons to show based on status
  const getWorkflowButtons = () => {
    if (!contract || updatingStatus) return null;

    const statusId = contract.contractStatusId;

    // Draft (1) or Pricing Needs Edited (4) - Show "Send for Approval"
    if (statusId === 1 || statusId === 4) {
      return (
        <Button
          variant='contained'
          color='primary'
          startIcon={
            updatingStatus ? (
              <CircularProgress size={20} color='inherit' />
            ) : (
              <SendIcon />
            )
          }
          onClick={handleSendForApproval}
          disabled={updatingStatus || hasChanges}
          sx={{ minWidth: 180 }}
        >
          {updatingStatus ? "Sending..." : "Send for Approval"}
        </Button>
      );
    }

    // Margin Approval (2) - Show "Approve" and "Reject"
    if (statusId === 2) {
      return (
        <>
          <Button
            variant='outlined'
            color='error'
            startIcon={
              updatingStatus ? (
                <CircularProgress size={20} color='inherit' />
              ) : (
                <ThumbDownIcon />
              )
            }
            onClick={handleReject}
            disabled={updatingStatus}
            sx={{ minWidth: 140 }}
          >
            {updatingStatus ? "Rejecting..." : "Reject"}
          </Button>
          <Button
            variant='contained'
            color='success'
            startIcon={
              updatingStatus ? (
                <CircularProgress size={20} color='inherit' />
              ) : (
                <ThumbUpIcon />
              )
            }
            onClick={handleApprove}
            disabled={updatingStatus}
            sx={{ minWidth: 140 }}
          >
            {updatingStatus ? "Approving..." : "Approve"}
          </Button>
        </>
      );
    }

    // For statuses 3, 5, 6, 7 - No workflow buttons
    return null;
  };

  // Determine button content based on state
  const getButtonContent = () => {
    if (saving) {
      return (
        <>
          <CircularProgress size={20} color='inherit' sx={{ mr: 1 }} />
          Saving...
        </>
      );
    }
    if (saveStatus === "success") {
      return (
        <>
          <CheckIcon sx={{ mr: 1 }} />
          Saved
        </>
      );
    }
    if (saveStatus === "error") {
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
        Save Changes
      </>
    );
  };

  // Determine button color
  const getButtonColor = () => {
    if (saveStatus === "success") return "success";
    if (saveStatus === "error") return "error";
    return "primary";
  };

  if (contractLoading) {
    return <Box sx={{ p: 3 }}>Loading contract...</Box>;
  }

  if (!contract) {
    return (
      <Alert severity='error'>
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
              color='secondary'
              sx={{ mr: 1 }}
            />
            <Chip
              label={contract.account?.name || "Unknown Account"}
              color='info'
              sx={{ mr: 1 }}
            />
            <Chip
              label={contract.contractStatus?.name || "Unknown Status"}
              color='primary'
              sx={{ mr: 1 }}
            />
            {contract.termLengthMonths && (
              <Chip
                label={`${contract.termLengthMonths} ${
                  contract.termLengthMonths === 1 ? "Month" : "Months"
                }`}
                variant='outlined'
              />
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          {showSavedIndicator && !hasChanges && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckIcon sx={{ color: "success.main" }} />
              <Typography
                variant='body2'
                sx={{ color: "success.main", fontWeight: "medium" }}
              >
                Saved
              </Typography>
            </Box>
          )}
          {hasChanges && (
            <Tooltip title='Discard Changes'>
              <IconButton color='error' onClick={handleDiscardChanges}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title='Save Changes'>
            <span>
              <IconButton
                color={getButtonColor()}
                onClick={handleSave}
                disabled={!hasChanges || saving}
              >
                {saving ? (
                  <CircularProgress size={24} />
                ) : saveStatus === "success" ? (
                  <CheckIcon />
                ) : saveStatus === "error" ? (
                  <ErrorIcon />
                ) : (
                  <SaveIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
          {getWorkflowButtons()}
        </Box>
      </Box>

      {/* Contract-level totals */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 1,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant='h6' sx={{ mb: 1 }}>
          Contract Totals
        </Typography>
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box>
            <Typography variant='caption' color='text.secondary'>
              Monthly Total
            </Typography>
            <Typography variant='body1' fontWeight='medium'>
              ${formatCurrency(contractMonthlyTotal)}
            </Typography>
          </Box>
          <Box>
            <Typography variant='caption' color='text.secondary'>
              Monthly Net
            </Typography>
            <Typography variant='body1' fontWeight='medium'>
              ${formatCurrency(contractMonthlyNet)}
            </Typography>
          </Box>
          <Box>
            <Typography variant='caption' color='text.secondary'>
              Contract Margin
            </Typography>
            <Typography
              variant='body1'
              fontWeight='medium'
              sx={{ color: getMarginColor(contractMargin) }}
            >
              {contractMargin.toFixed(1)}%
            </Typography>
          </Box>
        </Box>
      </Box>

    {/* Item Type Totals */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Item Type Totals</Typography>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {itemTypes.map(itemType => {
            // Calculate totals for this item type
            let totalCost = 0;
            let monthlyTotalRevenue = 0;
            let monthlyNetRevenue = 0;

            Object.values(state.segments).forEach(segmentState => {
              Object.values(segmentState.categories).forEach(categoryState => {
                Object.entries(categoryState.items).forEach(([itemIdStr, itemState]) => {
                  if (itemState.selected) {
                    const itemId = Number(itemIdStr);
                    const item = items.find(i => i.id === itemId);
                    if (!item || item.itemTypeId !== itemType.id) return;

                    const listPrice = item.listPrice || 0;
                    const cost = item.cost || 0;
                    const quantity = itemState.quantityCommitment ? parseFloat(itemState.quantityCommitment) : 1;

                    // Calculate net price per unit
                    const discountPercent = itemState.discountPercentage ? parseFloat(itemState.discountPercentage) / 100 : 0;
                    const priceAfterDiscount = listPrice * (1 - discountPercent);

                    const rebatePercent = itemState.rebatePercentage ? parseFloat(itemState.rebatePercentage) / 100 : 0;
                    const priceAfterRebate = priceAfterDiscount * (1 - rebatePercent);

                    const conditionalRebatePercent = itemState.conditionalRebate ? parseFloat(itemState.conditionalRebate) / 100 : 0;
                    const netPricePerUnit = priceAfterRebate * (1 - conditionalRebatePercent);

                    // Monthly revenue
                    monthlyTotalRevenue += priceAfterDiscount * quantity;
                    monthlyNetRevenue += netPricePerUnit * quantity;
                    totalCost += cost * quantity;
                  }
                });
              });
            });

            const margin = monthlyNetRevenue === 0 ? 0 : ((monthlyNetRevenue - totalCost) / monthlyNetRevenue) * 100;

            // Only show item type if it has selected items
            if (monthlyTotalRevenue === 0) return null;

            return (
              <Box key={itemType.id}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  {itemType.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Monthly Total</Typography>
                    <Typography variant="body2" fontWeight="medium">${formatCurrency(monthlyTotalRevenue)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Monthly Net</Typography>
                    <Typography variant="body2" fontWeight="medium">${formatCurrency(monthlyNetRevenue)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Margin</Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ color: getMarginColor(margin) }}>
                      {margin.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}></Box>
      <Box sx={{ mb: 2 }}>
        {vendorSegments.length === 0 ? (
          <Alert severity='info'>
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
                onSegmentPricingChange={(
                  itemTypeId,
                  discount,
                  rebate,
                  conditionalRebate,
                  growthRebate,
                  quantityCommitment
                ) =>
                  setSegmentPricing(
                    segment.id,
                    itemTypeId,
                    discount,
                    rebate,
                    conditionalRebate,
                    growthRebate,
                    quantityCommitment
                  )
                }
                onToggleCategory={(categoryId) =>
                  toggleCategory(segment.id, categoryId)
                }
                onCategoryPricingChange={(
                  categoryId,
                  itemTypeId,
                  discount,
                  rebate,
                  conditionalRebate,
                  growthRebate,
                  quantityCommitment
                ) =>
                  setCategoryPricing(
                    segment.id,
                    categoryId,
                    itemTypeId,
                    discount,
                    rebate,
                    conditionalRebate,
                    growthRebate,
                    quantityCommitment
                  )
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
                      .rebatePercentage,
                    segmentState.categories[categoryId].items[itemId]
                      .conditionalRebate,
                    segmentState.categories[categoryId].items[itemId]
                      .growthRebate,
                    segmentState.categories[categoryId].items[itemId]
                      .quantityCommitment
                  )
                }
                onItemRebateChange={(categoryId, itemId, value) =>
                  setItemPricing(
                    segment.id,
                    categoryId,
                    itemId,
                    segmentState.categories[categoryId].items[itemId]
                      .discountPercentage,
                    value,
                    segmentState.categories[categoryId].items[itemId]
                      .conditionalRebate,
                    segmentState.categories[categoryId].items[itemId]
                      .growthRebate,
                    segmentState.categories[categoryId].items[itemId]
                      .quantityCommitment
                  )
                }
                onItemConditionalRebateChange={(categoryId, itemId, value) =>
                  setItemPricing(
                    segment.id,
                    categoryId,
                    itemId,
                    segmentState.categories[categoryId].items[itemId]
                      .discountPercentage,
                    segmentState.categories[categoryId].items[itemId]
                      .rebatePercentage,
                    value,
                    segmentState.categories[categoryId].items[itemId]
                      .growthRebate,
                    segmentState.categories[categoryId].items[itemId]
                      .quantityCommitment
                  )
                }
                onItemGrowthRebateChange={(categoryId, itemId, value) =>
                  setItemPricing(
                    segment.id,
                    categoryId,
                    itemId,
                    segmentState.categories[categoryId].items[itemId]
                      .discountPercentage,
                    segmentState.categories[categoryId].items[itemId]
                      .rebatePercentage,
                    segmentState.categories[categoryId].items[itemId]
                      .conditionalRebate,
                    value,
                    segmentState.categories[categoryId].items[itemId]
                      .quantityCommitment
                  )
                }
                onItemQuantityCommitmentChange={(categoryId, itemId, value) =>
                  setItemPricing(
                    segment.id,
                    categoryId,
                    itemId,
                    segmentState.categories[categoryId].items[itemId]
                      .discountPercentage,
                    segmentState.categories[categoryId].items[itemId]
                      .rebatePercentage,
                    segmentState.categories[categoryId].items[itemId]
                      .conditionalRebate,
                    segmentState.categories[categoryId].items[itemId]
                      .growthRebate,
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
          mt: 3,
        }}
      >
        {showSavedIndicator && !hasChanges && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckIcon sx={{ color: "success.main" }} />
            <Typography
              variant='body2'
              sx={{ color: "success.main", fontWeight: "medium" }}
            >
              Saved
            </Typography>
          </Box>
        )}
        {hasChanges && (
          <Button
            variant='outlined'
            color='error'
            startIcon={<CloseIcon />}
            onClick={handleDiscardChanges}
            sx={{ minWidth: 160 }}
          >
            Discard Changes
          </Button>
        )}
        <Button
          variant='contained'
          color={getButtonColor()}
          onClick={handleSave}
          disabled={!hasChanges || saving}
          sx={{ minWidth: 180 }}
        >
          {getButtonContent()}
        </Button>
        {getWorkflowButtons()}
      </Box>
    </Box>
  );
}
