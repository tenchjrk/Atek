import { useReducer, useCallback, useEffect } from "react";
import type {
  ContractItem,
  VendorSegment,
  ItemCategory,
  Item,
  ItemType,
  ContractSegment,
  ContractCategory,
} from "../types";

interface ItemEditState {
  selected: boolean;
  discountPercentage: string;
  rebatePercentage: string;
  conditionalRebate: string;
  growthRebate: string;
  quantityCommitment: string;
  isDirty: boolean;
  existingContractItemId?: number;
  isInherited: boolean;
}

interface TypePricing {
  discountPercentage: string;
  rebatePercentage: string;
  conditionalRebate: string;
  growthRebate: string;
  quantityCommitment: string;
}

interface CategoryEditState {
  selected: boolean;
  pricingByType: Record<number, TypePricing>;
  itemSearch: string;
  items: Record<number, ItemEditState>;
}

interface SegmentEditState {
  selected: boolean;
  pricingByType: Record<number, TypePricing>;
  categories: Record<number, CategoryEditState>;
}

interface BulkEditState {
  segments: Record<number, SegmentEditState>;
  hasChanges: boolean;
}

type Action =
  | {
      type: "INITIALIZE";
      payload: {
        segments: VendorSegment[];
        categories: ItemCategory[];
        items: Item[];
        existingContractItems: ContractItem[];
        itemTypes: ItemType[];
        existingSegmentPricing: ContractSegment[];
        existingCategoryPricing: ContractCategory[];
      };
    }
  | {
      type: "SET_SEGMENT_PRICING";
      payload: {
        segmentId: number;
        itemTypeId: number;
        discount: string;
        rebate: string;
        conditionalRebate: string;
        growthRebate: string;
        quantityCommitment: string;
        items: Item[];
      };
    }
  | {
      type: "SET_CATEGORY_PRICING";
      payload: {
        segmentId: number;
        categoryId: number;
        itemTypeId: number;
        discount: string;
        rebate: string;
        conditionalRebate: string;
        growthRebate: string;
        quantityCommitment: string;
        items: Item[];
      };
    }
  | {
      type: "SET_ITEM_PRICING";
      payload: {
        segmentId: number;
        categoryId: number;
        itemId: number;
        discount: string;
        rebate: string;
        conditionalRebate: string;
        growthRebate: string;
        quantityCommitment: string;
        item: Item;
      };
    }
  | {
      type: "TOGGLE_ITEM";
      payload: { segmentId: number; categoryId: number; itemId: number };
    }
  | {
      type: "TOGGLE_CATEGORY";
      payload: { segmentId: number; categoryId: number };
    }
  | { type: "TOGGLE_SEGMENT"; payload: { segmentId: number } }
  | {
      type: "SET_CATEGORY_SEARCH";
      payload: { segmentId: number; categoryId: number; search: string };
    };

function createInitialState(
  segments: VendorSegment[],
  categories: ItemCategory[],
  items: Item[],
  existingContractItems: ContractItem[],
  itemTypes: ItemType[],
  existingSegmentPricing: ContractSegment[],
  existingCategoryPricing: ContractCategory[]
): BulkEditState {
  const state: BulkEditState = { segments: {}, hasChanges: false };

  // Create empty pricing for all item types
  const createEmptyPricingByType = (): Record<number, TypePricing> => {
    const pricing: Record<number, TypePricing> = {};
    itemTypes.forEach((type) => {
      pricing[type.id] = {
        discountPercentage: "",
        rebatePercentage: "",
        conditionalRebate: "",
        growthRebate: "",
        quantityCommitment: "",
      };
    });
    return pricing;
  };

  segments.forEach((segment) => {
    const segmentCategories = categories.filter(
      (c) => c.vendorSegmentId === segment.id
    );
    const categoryStates: Record<number, CategoryEditState> = {};

    // Create segment pricing by type
    const segmentPricingByType = createEmptyPricingByType();
    
    // Populate from existing segment pricing
    existingSegmentPricing
      .filter(sp => sp.vendorSegmentId === segment.id)
      .forEach(sp => {
        segmentPricingByType[sp.itemTypeId] = {
          discountPercentage: sp.discountPercentage?.toString() || '',
          rebatePercentage: sp.rebatePercentage?.toString() || '',
          conditionalRebate: sp.conditionalRebate?.toString() || '',
          growthRebate: sp.growthRebate?.toString() || '',
          quantityCommitment: ''
        };
      });

    segmentCategories.forEach((category) => {
      const categoryItems = items.filter(
        (i) => i.itemCategoryId === category.id
      );
      const itemStates: Record<number, ItemEditState> = {};

      // Create category pricing by type
      const categoryPricingByType = createEmptyPricingByType();
      
      // Populate from existing category pricing
      existingCategoryPricing
        .filter(cp => cp.itemCategoryId === category.id)
        .forEach(cp => {
          categoryPricingByType[cp.itemTypeId] = {
            discountPercentage: cp.discountPercentage?.toString() || '',
            rebatePercentage: cp.rebatePercentage?.toString() || '',
            conditionalRebate: cp.conditionalRebate?.toString() || '',
            growthRebate: cp.growthRebate?.toString() || '',
            quantityCommitment: ''
          };
        });

      categoryItems.forEach((item) => {
        const existing = existingContractItems.find(
          (ci) => ci.itemId === item.id
        );
        itemStates[item.id] = {
          selected: !!existing,
          discountPercentage: existing?.discountPercentage?.toString() || "",
          rebatePercentage: existing?.rebatePercentage?.toString() || "",
          conditionalRebate: existing?.conditionalRebate?.toString() || "",
          growthRebate: existing?.growthRebate?.toString() || "",
          quantityCommitment: existing?.quantityCommitment?.toString() || "",
          isDirty: false,
          existingContractItemId: existing?.id,
          isInherited: false,
        };
      });

      categoryStates[category.id] = {
        selected: false,
        pricingByType: categoryPricingByType,
        itemSearch: "",
        items: itemStates,
      };
    });

    state.segments[segment.id] = {
      selected: false,
      pricingByType: segmentPricingByType,
      categories: categoryStates,
    };
  });

  return state;
}

function reducer(state: BulkEditState, action: Action): BulkEditState {
  const newState = JSON.parse(JSON.stringify(state)) as BulkEditState;
  newState.hasChanges = true;

  switch (action.type) {
    case "INITIALIZE":
      return createInitialState(
        action.payload.segments,
        action.payload.categories,
        action.payload.items,
        action.payload.existingContractItems,
        action.payload.itemTypes,
        action.payload.existingSegmentPricing,
        action.payload.existingCategoryPricing
      );

    case "SET_SEGMENT_PRICING": {
      const {
        segmentId,
        itemTypeId,
        discount,
        rebate,
        conditionalRebate,
        growthRebate,
        quantityCommitment,
        items,
      } = action.payload;
      const segment = newState.segments[segmentId];

      // Get the previous values to determine what changed
      const prev = segment.pricingByType[itemTypeId];
      const discountChanged = discount !== prev.discountPercentage;
      const rebateChanged = rebate !== prev.rebatePercentage;
      const conditionalChanged = conditionalRebate !== prev.conditionalRebate;
      const growthChanged = growthRebate !== prev.growthRebate;
      const quantityChanged = quantityCommitment !== prev.quantityCommitment;

      // Set segment-level pricing for this type
      segment.pricingByType[itemTypeId].discountPercentage = discount;
      segment.pricingByType[itemTypeId].rebatePercentage = rebate;
      segment.pricingByType[itemTypeId].conditionalRebate = conditionalRebate;
      segment.pricingByType[itemTypeId].growthRebate = growthRebate;
      segment.pricingByType[itemTypeId].quantityCommitment = quantityCommitment;

      // Propagate to all categories and items of this type
      Object.entries(segment.categories).forEach(
        ([categoryId, category]: [string, CategoryEditState]) => {
          // Update category pricing - only fields that changed
          if (discountChanged)
            category.pricingByType[itemTypeId].discountPercentage = discount;
          if (rebateChanged)
            category.pricingByType[itemTypeId].rebatePercentage = rebate;
          if (conditionalChanged)
            category.pricingByType[itemTypeId].conditionalRebate =
              conditionalRebate;
          if (growthChanged)
            category.pricingByType[itemTypeId].growthRebate = growthRebate;
          if (quantityChanged)
            category.pricingByType[itemTypeId].quantityCommitment =
              quantityCommitment;

          // Get items in this category
          const categoryItems = items.filter(
            (i) => i.itemCategoryId === Number(categoryId)
          );

          Object.entries(category.items).forEach(
            ([, item]: [string, ItemEditState]) => {
              const itemId = Number(
                Object.keys(category.items).find(
                  (key) => category.items[Number(key)] === item
                )
              );
              const itemData = categoryItems.find((i) => i.id === itemId);

              // Only propagate to items of matching type that aren't dirty
              if (
                itemData &&
                itemData.itemTypeId === itemTypeId &&
                !item.isDirty
              ) {
                // Only update fields that changed
                if (discountChanged) item.discountPercentage = discount;
                if (rebateChanged) item.rebatePercentage = rebate;
                if (conditionalChanged)
                  item.conditionalRebate = conditionalRebate;
                if (growthChanged) item.growthRebate = growthRebate;
                if (quantityChanged)
                  item.quantityCommitment = quantityCommitment;
                item.isInherited = true;
              }
            }
          );
        }
      );
      return newState;
    }

    case "SET_CATEGORY_PRICING": {
      const {
        segmentId,
        categoryId,
        itemTypeId,
        discount,
        rebate,
        conditionalRebate,
        growthRebate,
        quantityCommitment,
        items,
      } = action.payload;
      const category = newState.segments[segmentId].categories[categoryId];

      // Get the previous values to determine what changed
      const prev = category.pricingByType[itemTypeId];
      const discountChanged = discount !== prev.discountPercentage;
      const rebateChanged = rebate !== prev.rebatePercentage;
      const conditionalChanged = conditionalRebate !== prev.conditionalRebate;
      const growthChanged = growthRebate !== prev.growthRebate;
      const quantityChanged = quantityCommitment !== prev.quantityCommitment;

      // Set category-level pricing for this type
      category.pricingByType[itemTypeId].discountPercentage = discount;
      category.pricingByType[itemTypeId].rebatePercentage = rebate;
      category.pricingByType[itemTypeId].conditionalRebate = conditionalRebate;
      category.pricingByType[itemTypeId].growthRebate = growthRebate;
      category.pricingByType[itemTypeId].quantityCommitment =
        quantityCommitment;

      // Clear segment pricing for this type - only fields that changed
      if (discountChanged)
        newState.segments[segmentId].pricingByType[
          itemTypeId
        ].discountPercentage = "";
      if (rebateChanged)
        newState.segments[segmentId].pricingByType[
          itemTypeId
        ].rebatePercentage = "";
      if (conditionalChanged)
        newState.segments[segmentId].pricingByType[
          itemTypeId
        ].conditionalRebate = "";
      if (growthChanged)
        newState.segments[segmentId].pricingByType[itemTypeId].growthRebate =
          "";
      if (quantityChanged)
        newState.segments[segmentId].pricingByType[
          itemTypeId
        ].quantityCommitment = "";

      // Get items in this category
      const categoryItems = items.filter(
        (i) => i.itemCategoryId === categoryId
      );

      // Propagate to all items of this type in category
      Object.entries(category.items).forEach(
        ([itemIdStr, item]: [string, ItemEditState]) => {
          const itemId = Number(itemIdStr);
          const itemData = categoryItems.find((i) => i.id === itemId);

          // Only propagate to items of matching type that aren't dirty
          if (itemData && itemData.itemTypeId === itemTypeId && !item.isDirty) {
            // Only update fields that changed
            if (discountChanged) item.discountPercentage = discount;
            if (rebateChanged) item.rebatePercentage = rebate;
            if (conditionalChanged) item.conditionalRebate = conditionalRebate;
            if (growthChanged) item.growthRebate = growthRebate;
            if (quantityChanged) item.quantityCommitment = quantityCommitment;
            item.isInherited = true;
          }
        }
      );
      return newState;
    }

    case "SET_ITEM_PRICING": {
      const {
        segmentId,
        categoryId,
        itemId,
        discount,
        rebate,
        conditionalRebate,
        growthRebate,
        quantityCommitment,
        item: itemData,
      } = action.payload;
      const item =
        newState.segments[segmentId].categories[categoryId].items[itemId];

      item.discountPercentage = discount;
      item.rebatePercentage = rebate;
      item.conditionalRebate = conditionalRebate;
      item.growthRebate = growthRebate;
      item.quantityCommitment = quantityCommitment;
      item.isDirty = true;
      item.isInherited = false;

      // Clear the pricing for this item's type at segment/category level
      const itemTypeId = itemData.itemTypeId;
      newState.segments[segmentId].pricingByType[
        itemTypeId
      ].discountPercentage = "";
      newState.segments[segmentId].pricingByType[itemTypeId].rebatePercentage =
        "";
      newState.segments[segmentId].pricingByType[itemTypeId].conditionalRebate =
        "";
      newState.segments[segmentId].pricingByType[itemTypeId].growthRebate = "";
      newState.segments[segmentId].pricingByType[
        itemTypeId
      ].quantityCommitment = "";
      newState.segments[segmentId].categories[categoryId].pricingByType[
        itemTypeId
      ].discountPercentage = "";
      newState.segments[segmentId].categories[categoryId].pricingByType[
        itemTypeId
      ].rebatePercentage = "";
      newState.segments[segmentId].categories[categoryId].pricingByType[
        itemTypeId
      ].conditionalRebate = "";
      newState.segments[segmentId].categories[categoryId].pricingByType[
        itemTypeId
      ].growthRebate = "";
      newState.segments[segmentId].categories[categoryId].pricingByType[
        itemTypeId
      ].quantityCommitment = "";

      return newState;
    }

    case "TOGGLE_ITEM": {
      const { segmentId, categoryId, itemId } = action.payload;
      const item =
        newState.segments[segmentId].categories[categoryId].items[itemId];
      item.selected = !item.selected;
      return newState;
    }

    case "TOGGLE_CATEGORY": {
      const { segmentId, categoryId } = action.payload;
      const category = newState.segments[segmentId].categories[categoryId];
      const allSelected = Object.values(category.items).every(
        (item: ItemEditState) => item.selected
      );

      Object.values(category.items).forEach((item: ItemEditState) => {
        item.selected = !allSelected;
      });
      return newState;
    }

    case "TOGGLE_SEGMENT": {
      const { segmentId } = action.payload;
      const segment = newState.segments[segmentId];
      const allSelected = Object.values(segment.categories).every(
        (category: CategoryEditState) =>
          Object.values(category.items).every(
            (item: ItemEditState) => item.selected
          )
      );

      Object.values(segment.categories).forEach(
        (category: CategoryEditState) => {
          Object.values(category.items).forEach((item: ItemEditState) => {
            item.selected = !allSelected;
          });
        }
      );
      return newState;
    }

    case "SET_CATEGORY_SEARCH": {
      const { segmentId, categoryId, search } = action.payload;
      newState.segments[segmentId].categories[categoryId].itemSearch = search;
      newState.hasChanges = false;
      return newState;
    }

    default:
      return state;
  }
}

export function useContractItemBulkEdit(
  segments: VendorSegment[],
  categories: ItemCategory[],
  items: Item[],
  existingContractItems: ContractItem[],
  itemTypes: ItemType[],
  existingSegmentPricing: ContractSegment[],
  existingCategoryPricing: ContractCategory[],
  resetTrigger: number = 0
) {
  const [state, dispatch] = useReducer(reducer, {
    segments: {},
    hasChanges: false,
  });

  // Initialize when data is available OR when resetTrigger changes
  useEffect(() => {
    if (segments.length > 0 && itemTypes.length > 0) {
      dispatch({
        type: "INITIALIZE",
        payload: {
          segments,
          categories,
          items,
          existingContractItems,
          itemTypes,
          existingSegmentPricing,
          existingCategoryPricing,
        },
      });
    }
  }, [
    segments,
    categories,
    items,
    existingContractItems,
    itemTypes,
    existingSegmentPricing,
    existingCategoryPricing,
    resetTrigger,
  ]);

  const setSegmentPricing = useCallback(
    (
      segmentId: number,
      itemTypeId: number,
      discount: string,
      rebate: string,
      conditionalRebate: string,
      growthRebate: string,
      quantityCommitment: string
    ) => {
      dispatch({
        type: "SET_SEGMENT_PRICING",
        payload: {
          segmentId,
          itemTypeId,
          discount,
          rebate,
          conditionalRebate,
          growthRebate,
          quantityCommitment,
          items,
        },
      });
    },
    [items]
  );

  const setCategoryPricing = useCallback(
    (
      segmentId: number,
      categoryId: number,
      itemTypeId: number,
      discount: string,
      rebate: string,
      conditionalRebate: string,
      growthRebate: string,
      quantityCommitment: string
    ) => {
      dispatch({
        type: "SET_CATEGORY_PRICING",
        payload: {
          segmentId,
          categoryId,
          itemTypeId,
          discount,
          rebate,
          conditionalRebate,
          growthRebate,
          quantityCommitment,
          items,
        },
      });
    },
    [items]
  );

  const setItemPricing = useCallback(
    (
      segmentId: number,
      categoryId: number,
      itemId: number,
      discount: string,
      rebate: string,
      conditionalRebate: string,
      growthRebate: string,
      quantityCommitment: string
    ) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;
      dispatch({
        type: "SET_ITEM_PRICING",
        payload: {
          segmentId,
          categoryId,
          itemId,
          discount,
          rebate,
          conditionalRebate,
          growthRebate,
          quantityCommitment,
          item,
        },
      });
    },
    [items]
  );

  const toggleItem = useCallback(
    (segmentId: number, categoryId: number, itemId: number) => {
      dispatch({
        type: "TOGGLE_ITEM",
        payload: { segmentId, categoryId, itemId },
      });
    },
    []
  );

  const toggleCategory = useCallback(
    (segmentId: number, categoryId: number) => {
      dispatch({ type: "TOGGLE_CATEGORY", payload: { segmentId, categoryId } });
    },
    []
  );

  const toggleSegment = useCallback((segmentId: number) => {
    dispatch({ type: "TOGGLE_SEGMENT", payload: { segmentId } });
  }, []);

  const setCategorySearch = useCallback(
    (segmentId: number, categoryId: number, search: string) => {
      dispatch({
        type: "SET_CATEGORY_SEARCH",
        payload: { segmentId, categoryId, search },
      });
    },
    []
  );

  const getChanges = useCallback(() => {
    const toCreate: Array<{ 
      itemId: number; 
      discountPercentage: number | null; 
      rebatePercentage: number | null;
      conditionalRebate: number | null;
      growthRebate: number | null;
      quantityCommitment: number | null;
    }> = [];
    const toUpdate: Array<{ 
      id: number; 
      itemId: number; 
      discountPercentage: number | null; 
      rebatePercentage: number | null;
      conditionalRebate: number | null;
      growthRebate: number | null;
      quantityCommitment: number | null;
    }> = [];
    const toDelete: number[] = [];
    
    // New: Arrays for segment and category pricing
    const segmentPricing: Array<{
      segmentId: number;
      itemTypeId: number;
      discountPercentage: number | null;
      rebatePercentage: number | null;
      conditionalRebate: number | null;
      growthRebate: number | null;
    }> = [];
    
    const categoryPricing: Array<{
      categoryId: number;
      itemTypeId: number;
      discountPercentage: number | null;
      rebatePercentage: number | null;
      conditionalRebate: number | null;
      growthRebate: number | null;
    }> = [];

    // Process segments and categories
    Object.entries(state.segments).forEach(([segmentId, segment]) => {
      // Collect segment-level pricing
      Object.entries(segment.pricingByType).forEach(([itemTypeId, pricing]) => {
        if (pricing.discountPercentage || pricing.rebatePercentage || pricing.conditionalRebate || pricing.growthRebate) {
          segmentPricing.push({
            segmentId: Number(segmentId),
            itemTypeId: Number(itemTypeId),
            discountPercentage: pricing.discountPercentage ? parseFloat(pricing.discountPercentage) : null,
            rebatePercentage: pricing.rebatePercentage ? parseFloat(pricing.rebatePercentage) : null,
            conditionalRebate: pricing.conditionalRebate ? parseFloat(pricing.conditionalRebate) : null,
            growthRebate: pricing.growthRebate ? parseFloat(pricing.growthRebate) : null,
          });
        }
      });
      
      // Collect category-level pricing
      Object.entries(segment.categories).forEach(([categoryId, category]) => {
        Object.entries(category.pricingByType).forEach(([itemTypeId, pricing]) => {
          if (pricing.discountPercentage || pricing.rebatePercentage || pricing.conditionalRebate || pricing.growthRebate) {
            categoryPricing.push({
              categoryId: Number(categoryId),
              itemTypeId: Number(itemTypeId),
              discountPercentage: pricing.discountPercentage ? parseFloat(pricing.discountPercentage) : null,
              rebatePercentage: pricing.rebatePercentage ? parseFloat(pricing.rebatePercentage) : null,
              conditionalRebate: pricing.conditionalRebate ? parseFloat(pricing.conditionalRebate) : null,
              growthRebate: pricing.growthRebate ? parseFloat(pricing.growthRebate) : null,
            });
          }
        });
        
        // Process items
        Object.entries(category.items).forEach(([itemId, item]) => {
          const numItemId = Number(itemId);
          
          if (item.selected && !item.existingContractItemId) {
            toCreate.push({
              itemId: numItemId,
              discountPercentage: item.discountPercentage ? parseFloat(item.discountPercentage) : null,
              rebatePercentage: item.rebatePercentage ? parseFloat(item.rebatePercentage) : null,
              conditionalRebate: item.conditionalRebate ? parseFloat(item.conditionalRebate) : null,
              growthRebate: item.growthRebate ? parseFloat(item.growthRebate) : null,
              quantityCommitment: item.quantityCommitment ? parseInt(item.quantityCommitment) : null,
            });
          } else if (item.selected && item.existingContractItemId) {
            // Check if values have changed from existing
            const existing = existingContractItems.find(ci => ci.id === item.existingContractItemId);
            const hasChanged = !existing || 
              existing.discountPercentage?.toString() !== item.discountPercentage ||
              existing.rebatePercentage?.toString() !== item.rebatePercentage ||
              existing.conditionalRebate?.toString() !== item.conditionalRebate ||
              existing.growthRebate?.toString() !== item.growthRebate ||
              existing.quantityCommitment?.toString() !== item.quantityCommitment;

            if (hasChanged) {
              toUpdate.push({
                id: item.existingContractItemId,
                itemId: numItemId,
                discountPercentage: item.discountPercentage ? parseFloat(item.discountPercentage) : null,
                rebatePercentage: item.rebatePercentage ? parseFloat(item.rebatePercentage) : null,
                conditionalRebate: item.conditionalRebate ? parseFloat(item.conditionalRebate) : null,
                growthRebate: item.growthRebate ? parseFloat(item.growthRebate) : null,
                quantityCommitment: item.quantityCommitment ? parseInt(item.quantityCommitment) : null,
              });
            }
          } else if (!item.selected && item.existingContractItemId) {
            toDelete.push(item.existingContractItemId);
          }
        });
      });
    });

    return { toCreate, toUpdate, toDelete, segmentPricing, categoryPricing };
  }, [state, existingContractItems]);

  return {
    state,
    hasChanges: state.hasChanges,
    setSegmentPricing,
    setCategoryPricing,
    setItemPricing,
    toggleItem,
    toggleCategory,
    toggleSegment,
    setCategorySearch,
    getChanges,
  };
}