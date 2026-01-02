import { useState, useEffect } from "react";
import { Box, Button, Chip, Alert } from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
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

  // Use the bulk edit hook
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
    itemTypes
  );

  const handleSave = async () => {
    setSaving(true);
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

      alert("Changes saved successfully!");
    } catch (err) {
      console.error("Error saving changes:", err);
      alert("Error saving changes. Please try again.");
    } finally {
      setSaving(false);
    }
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
            title={`Contract Items: ${contract.name}`}
            subtitle={`Select items and set pricing for this contract`}
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
            />
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!hasChanges || saving}
          sx={{ mt: 1 }}
        >
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
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

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!hasChanges || saving}
        >
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </Box>
    </Box>
  );
}