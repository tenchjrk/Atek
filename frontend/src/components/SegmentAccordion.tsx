import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  TextField,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import CategoryAccordion from './CategoryAccordion';
import type { VendorSegment, ItemCategory, Item } from '../types';

interface SegmentAccordionProps {
  segment: VendorSegment;
  categories: ItemCategory[];
  items: Item[];
  segmentState: {
    selected: boolean;
    discountPercentage: string;
    rebatePercentage: string;
    categories: Record<number, {
      selected: boolean;
      discountPercentage: string;
      rebatePercentage: string;
      itemSearch: string;
      items: Record<number, {
        selected: boolean;
        discountPercentage: string;
        rebatePercentage: string;
        isDirty: boolean;
        isInherited: boolean;
      }>;
    }>;
  };
  onToggleSegment: () => void;
  onSegmentDiscountChange: (value: string) => void;
  onSegmentRebateChange: (value: string) => void;
  onToggleCategory: (categoryId: number) => void;
  onCategoryDiscountChange: (categoryId: number, value: string) => void;
  onCategoryRebateChange: (categoryId: number, value: string) => void;
  onToggleItem: (categoryId: number, itemId: number) => void;
  onItemDiscountChange: (categoryId: number, itemId: number, value: string) => void;
  onItemRebateChange: (categoryId: number, itemId: number, value: string) => void;
  onCategorySearchChange: (categoryId: number, value: string) => void;
}

export default function SegmentAccordion({
  segment,
  categories,
  items,
  segmentState,
  onToggleSegment,
  onSegmentDiscountChange,
  onSegmentRebateChange,
  onToggleCategory,
  onCategoryDiscountChange,
  onCategoryRebateChange,
  onToggleItem,
  onItemDiscountChange,
  onItemRebateChange,
  onCategorySearchChange,
}: SegmentAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  // Calculate checkbox state (checked/indeterminate)
  const allItems: number[] = [];
  categories.forEach(category => {
    const categoryItems = items.filter(i => i.itemCategoryId === category.id);
    categoryItems.forEach(item => allItems.push(item.id));
  });

  const selectedCount = allItems.filter(itemId => {
    // Find which category this item belongs to
    const item = items.find(i => i.id === itemId);
    if (!item) return false;
    const categoryId = item.itemCategoryId;
    return segmentState.categories[categoryId]?.items[itemId]?.selected;
  }).length;

  const isAllSelected = selectedCount === allItems.length && allItems.length > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < allItems.length;

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2 } }}
      >
        <Checkbox
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={(e) => {
            e.stopPropagation();
            onToggleSegment();
          }}
          onClick={(e) => e.stopPropagation()}
        />
        
        <Typography sx={{ flex: 1, fontWeight: 'bold' }}>
          Segment: {segment.name}
        </Typography>

        <TextField
          label="Segment Discount %"
          type="number"
          size="small"
          value={segmentState.discountPercentage}
          onChange={(e) => {
            e.stopPropagation();
            onSegmentDiscountChange(e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          inputProps={{ min: 0, max: 100, step: 0.01 }}
          sx={{ width: 150 }}
        />

        <TextField
          label="Segment Rebate %"
          type="number"
          size="small"
          value={segmentState.rebatePercentage}
          onChange={(e) => {
            e.stopPropagation();
            onSegmentRebateChange(e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          inputProps={{ min: 0, max: 100, step: 0.01 }}
          sx={{ width: 150 }}
        />
      </AccordionSummary>
      
      <AccordionDetails sx={{ p: 0 }}>
        {categories.map(category => {
          const categoryItems = items.filter(i => i.itemCategoryId === category.id);
          return (
            <CategoryAccordion
              key={category.id}
              category={category}
              items={categoryItems}
              categoryState={segmentState.categories[category.id]}
              segmentId={segment.id}
              onToggleCategory={() => onToggleCategory(category.id)}
              onCategoryDiscountChange={(value) => onCategoryDiscountChange(category.id, value)}
              onCategoryRebateChange={(value) => onCategoryRebateChange(category.id, value)}
              onToggleItem={(itemId) => onToggleItem(category.id, itemId)}
              onItemDiscountChange={(itemId, value) => onItemDiscountChange(category.id, itemId, value)}
              onItemRebateChange={(itemId, value) => onItemRebateChange(category.id, itemId, value)}
              onSearchChange={(value) => onCategorySearchChange(category.id, value)}
            />
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
}