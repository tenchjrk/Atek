import { useState, useCallback } from 'react';
import type { ContractItem, VendorSegment, ItemCategory, Item } from '../types';

interface ItemEditState {
  selected: boolean;
  discountPercentage: string;
  rebatePercentage: string;
  isDirty: boolean;
  existingContractItemId?: number;
  isInherited: boolean;
}

interface CategoryEditState {
  selected: boolean;
  discountPercentage: string;
  rebatePercentage: string;
  itemSearch: string;
  items: Record<number, ItemEditState>;
}

interface SegmentEditState {
  selected: boolean;
  discountPercentage: string;
  rebatePercentage: string;
  categories: Record<number, CategoryEditState>;
}

interface BulkEditState {
  segments: Record<number, SegmentEditState>;
}

function createInitialState(
  segments: VendorSegment[],
  categories: ItemCategory[],
  items: Item[],
  existingContractItems: ContractItem[]
): BulkEditState {
  const initialState: BulkEditState = { segments: {} };

  segments.forEach(segment => {
    const segmentCategories = categories.filter(c => c.vendorSegmentId === segment.id);
    const categoryStates: Record<number, CategoryEditState> = {};

    segmentCategories.forEach(category => {
      const categoryItems = items.filter(i => i.itemCategoryId === category.id);
      const itemStates: Record<number, ItemEditState> = {};

      categoryItems.forEach(item => {
        const existing = existingContractItems.find(ci => ci.itemId === item.id);
        itemStates[item.id] = {
          selected: !!existing,
          discountPercentage: existing?.discountPercentage?.toString() || '',
          rebatePercentage: existing?.rebatePercentage?.toString() || '',
          isDirty: false,
          existingContractItemId: existing?.id,
          isInherited: false,
        };
      });

      categoryStates[category.id] = {
        selected: false,
        discountPercentage: '',
        rebatePercentage: '',
        itemSearch: '',
        items: itemStates,
      };
    });

    initialState.segments[segment.id] = {
      selected: false,
      discountPercentage: '',
      rebatePercentage: '',
      categories: categoryStates,
    };
  });

  return initialState;
}

export function useContractItemBulkEdit(
  segments: VendorSegment[],
  categories: ItemCategory[],
  items: Item[],
  existingContractItems: ContractItem[]
) {
  // Create a stable key from the data to track when it changes
  const dataKey = `${segments.length}-${categories.length}-${items.length}-${existingContractItems.length}`;
  
  const [state, setState] = useState<BulkEditState>(() => 
    createInitialState(segments, categories, items, existingContractItems)
  );
  const [lastDataKey, setLastDataKey] = useState(dataKey);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset state when data changes
  if (dataKey !== lastDataKey) {
    const newState = createInitialState(segments, categories, items, existingContractItems);
    setState(newState);
    setLastDataKey(dataKey);
    setHasChanges(false);
  }

  // Set segment-level discount/rebate (propagates down)
  const setSegmentPricing = useCallback((segmentId: number, discount: string, rebate: string) => {
    setState(prev => {
      const newState = JSON.parse(JSON.stringify(prev)) as BulkEditState;
      const segment = newState.segments[segmentId];
      
      segment.discountPercentage = discount;
      segment.rebatePercentage = rebate;

      // Propagate to all categories and items
      Object.values(segment.categories).forEach((category: CategoryEditState) => {
        category.discountPercentage = discount;
        category.rebatePercentage = rebate;
        
        Object.values(category.items).forEach((item: ItemEditState) => {
          if (!item.isDirty) {
            item.discountPercentage = discount;
            item.rebatePercentage = rebate;
            item.isInherited = true;
          }
        });
      });

      return newState;
    });
    setHasChanges(true);
  }, []);

  // Set category-level discount/rebate (propagates down)
  const setCategoryPricing = useCallback((segmentId: number, categoryId: number, discount: string, rebate: string) => {
    setState(prev => {
      const newState = JSON.parse(JSON.stringify(prev)) as BulkEditState;
      const category = newState.segments[segmentId].categories[categoryId];
      
      category.discountPercentage = discount;
      category.rebatePercentage = rebate;

      // Clear segment pricing since category is overriding
      newState.segments[segmentId].discountPercentage = '';
      newState.segments[segmentId].rebatePercentage = '';

      // Propagate to all items in category
      Object.values(category.items).forEach((item: ItemEditState) => {
        if (!item.isDirty) {
          item.discountPercentage = discount;
          item.rebatePercentage = rebate;
          item.isInherited = true;
        }
      });

      return newState;
    });
    setHasChanges(true);
  }, []);

  // Set item-level discount/rebate (clears parent values)
  const setItemPricing = useCallback((segmentId: number, categoryId: number, itemId: number, discount: string, rebate: string) => {
    setState(prev => {
      const newState = JSON.parse(JSON.stringify(prev)) as BulkEditState;
      const item = newState.segments[segmentId].categories[categoryId].items[itemId];
      
      item.discountPercentage = discount;
      item.rebatePercentage = rebate;
      item.isDirty = true;
      item.isInherited = false;

      // Clear parent pricing
      newState.segments[segmentId].discountPercentage = '';
      newState.segments[segmentId].rebatePercentage = '';
      newState.segments[segmentId].categories[categoryId].discountPercentage = '';
      newState.segments[segmentId].categories[categoryId].rebatePercentage = '';

      return newState;
    });
    setHasChanges(true);
  }, []);

  // Toggle item selection
  const toggleItem = useCallback((segmentId: number, categoryId: number, itemId: number) => {
    setState(prev => {
      const newState = JSON.parse(JSON.stringify(prev)) as BulkEditState;
      const item = newState.segments[segmentId].categories[categoryId].items[itemId];
      item.selected = !item.selected;
      return newState;
    });
    setHasChanges(true);
  }, []);

  // Select all items in category
  const toggleCategory = useCallback((segmentId: number, categoryId: number) => {
    setState(prev => {
      const newState = JSON.parse(JSON.stringify(prev)) as BulkEditState;
      const category = newState.segments[segmentId].categories[categoryId];
      const allSelected = Object.values(category.items).every((item: ItemEditState) => item.selected);
      
      Object.values(category.items).forEach((item: ItemEditState) => {
        item.selected = !allSelected;
      });

      return newState;
    });
    setHasChanges(true);
  }, []);

  // Select all items in segment
  const toggleSegment = useCallback((segmentId: number) => {
    setState(prev => {
      const newState = JSON.parse(JSON.stringify(prev)) as BulkEditState;
      const segment = newState.segments[segmentId];
      const allSelected = Object.values(segment.categories).every((category: CategoryEditState) =>
        Object.values(category.items).every((item: ItemEditState) => item.selected)
      );

      Object.values(segment.categories).forEach((category: CategoryEditState) => {
        Object.values(category.items).forEach((item: ItemEditState) => {
          item.selected = !allSelected;
        });
      });

      return newState;
    });
    setHasChanges(true);
  }, []);

  // Set category search
  const setCategorySearch = useCallback((segmentId: number, categoryId: number, search: string) => {
    setState(prev => {
      const newState = JSON.parse(JSON.stringify(prev)) as BulkEditState;
      newState.segments[segmentId].categories[categoryId].itemSearch = search;
      return newState;
    });
  }, []);

  // Get changes to save
  const getChanges = useCallback(() => {
    const toCreate: Array<{ itemId: number; discountPercentage: number | null; rebatePercentage: number | null }> = [];
    const toUpdate: Array<{ id: number; itemId: number; discountPercentage: number | null; rebatePercentage: number | null }> = [];
    const toDelete: number[] = [];

    Object.values(state.segments).forEach(segment => {
      Object.values(segment.categories).forEach(category => {
        Object.entries(category.items).forEach(([itemId, item]) => {
          const numItemId = Number(itemId);
          
          if (item.selected && !item.existingContractItemId) {
            // New item to add
            toCreate.push({
              itemId: numItemId,
              discountPercentage: item.discountPercentage ? parseFloat(item.discountPercentage) : null,
              rebatePercentage: item.rebatePercentage ? parseFloat(item.rebatePercentage) : null,
            });
          } else if (item.selected && item.existingContractItemId && item.isDirty) {
            // Existing item to update
            toUpdate.push({
              id: item.existingContractItemId,
              itemId: numItemId,
              discountPercentage: item.discountPercentage ? parseFloat(item.discountPercentage) : null,
              rebatePercentage: item.rebatePercentage ? parseFloat(item.rebatePercentage) : null,
            });
          } else if (!item.selected && item.existingContractItemId) {
            // Existing item to delete
            toDelete.push(item.existingContractItemId);
          }
        });
      });
    });

    return { toCreate, toUpdate, toDelete };
  }, [state]);

  return {
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
  };
}