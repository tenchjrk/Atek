import {
  Box,
  TextField,
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
  searchTerm: string;
  onSearchChange: (value: string) => void;
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
  searchTerm,
  onSearchChange,
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
  // Filter segments based on selected vendor
  const filteredSegments = vendorFilter
    ? segments.filter((s) => s.vendorId === vendorFilter)
    : segments;

  // Filter categories based on selected segment
  const filteredCategories = segmentFilter
    ? categories.filter((c) => c.vendorSegmentId === segmentFilter)
    : categories;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder='Search items...'
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ flexGrow: 1, minWidth: "200px" }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Vendor</InputLabel>
          <Select
            value={vendorFilter}
            label='Vendor'
            onChange={(e) => {
              onVendorFilterChange(e.target.value as number | "");
              onSegmentFilterChange("");
              onCategoryFilterChange("");
            }}
          >
            <MenuItem value=''>All Vendors</MenuItem>
            {vendors.map((vendor) => (
              <MenuItem key={vendor.id} value={vendor.id}>
                {vendor.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Segment</InputLabel>
          <Select
            value={segmentFilter}
            label='Segment'
            onChange={(e) => {
              onSegmentFilterChange(e.target.value as number | "");
              onCategoryFilterChange("");
            }}
            disabled={!vendorFilter}
          >
            <MenuItem value=''>All Segments</MenuItem>
            {filteredSegments.map((segment) => (
              <MenuItem key={segment.id} value={segment.id}>
                {segment.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label='Category'
            onChange={(e) =>
              onCategoryFilterChange(e.target.value as number | "")
            }
            disabled={!segmentFilter}
          >
            <MenuItem value=''>All Categories</MenuItem>
            {filteredCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
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
        <FormControl sx={{ minWidth: 150 }}>
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={`${activeFilterCount} filter${
              activeFilterCount > 1 ? "s" : ""
            } active`}
            onDelete={onClearFilters}
            deleteIcon={<ClearIcon />}
            color='primary'
            variant='outlined'
          />
          <Button size='small' onClick={onClearFilters}>
            Clear all filters
          </Button>
        </Box>
      )}
    </Box>
  );
}
