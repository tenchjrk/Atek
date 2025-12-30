import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import type {
  Vendor,
  VendorSegment,
  ItemCategory,
  ItemType,
  UnitOfMeasure,
} from "../types";

interface ItemFiltersProps {
  vendorFilter: number | "";
  onVendorFilterChange: (value: number | "") => void;
  segmentFilter: number | "";
  onSegmentFilterChange: (value: number | "") => void;
  categoryFilter: number | "";
  onCategoryFilterChange: (value: number | "") => void;
  itemTypeFilter: number | "";
  onItemTypeFilterChange: (value: number | "") => void;
  unitOfMeasureFilter: number | "";
  onUnitOfMeasureFilterChange: (value: number | "") => void;
  vendors: Vendor[];
  segments: VendorSegment[];
  categories: ItemCategory[];
  itemTypes: ItemType[];
  unitOfMeasures: UnitOfMeasure[];
  onClearFilters: () => void;
  activeFilterCount: number;
}

export default function ItemFilters({
  vendorFilter,
  onVendorFilterChange,
  segmentFilter,
  onSegmentFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  itemTypeFilter,
  onItemTypeFilterChange,
  unitOfMeasureFilter,
  onUnitOfMeasureFilterChange,
  vendors,
  segments,
  categories,
  itemTypes,
  unitOfMeasures,
  onClearFilters,
  activeFilterCount,
}: ItemFiltersProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 150, flex: 1 }}>
          <InputLabel>Vendor</InputLabel>
          <Select
            value={vendorFilter}
            label='Vendor'
            onChange={(e) => onVendorFilterChange(e.target.value as number | "")}
          >
            <MenuItem value=''>All Vendors</MenuItem>
            {vendors.map((vendor) => (
              <MenuItem key={vendor.id} value={vendor.id}>
                {vendor.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150, flex: 1 }}>
          <InputLabel>Segment</InputLabel>
          <Select
            value={segmentFilter}
            label='Segment'
            onChange={(e) => onSegmentFilterChange(e.target.value as number | "")}
          >
            <MenuItem value=''>All Segments</MenuItem>
            {segments.map((segment) => (
              <MenuItem key={segment.id} value={segment.id}>
                {segment.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150, flex: 1 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label='Category'
            onChange={(e) =>
              onCategoryFilterChange(e.target.value as number | "")
            }
          >
            <MenuItem value=''>All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150, flex: 1 }}>
          <InputLabel>Item Type</InputLabel>
          <Select
            value={itemTypeFilter}
            label='Item Type'
            onChange={(e) =>
              onItemTypeFilterChange(e.target.value as number | "")
            }
          >
            <MenuItem value=''>All Types</MenuItem>
            {itemTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150, flex: 1 }}>
          <InputLabel>UOM</InputLabel>
          <Select
            value={unitOfMeasureFilter}
            label='UOM'
            onChange={(e) =>
              onUnitOfMeasureFilterChange(e.target.value as number | "")
            }
          >
            <MenuItem value=''>All Units</MenuItem>
            {unitOfMeasures.map((uom) => (
              <MenuItem key={uom.id} value={uom.id}>
                {uom.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {activeFilterCount > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${activeFilterCount} filter${
              activeFilterCount > 1 ? "s" : ""
            } active`}
            color='primary'
            variant='outlined'
          />
          <Button 
            size="small" 
            onClick={onClearFilters}
            startIcon={<ClearIcon />}
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Box>
  );
}