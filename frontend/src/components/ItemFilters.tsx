import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Checkbox,
  ListItemText,
  TextField,
  Stack,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import { useState } from "react";
import type {
  Vendor,
  VendorSegment,
  ItemCategory,
  ItemType,
  UnitOfMeasure,
} from "../types";

interface ItemFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  vendorFilter: number[];
  onVendorFilterChange: (value: number[]) => void;
  segmentFilter: number[];
  onSegmentFilterChange: (value: number[]) => void;
  categoryFilter: number[];
  onCategoryFilterChange: (value: number[]) => void;
  itemTypeFilter: number[];
  onItemTypeFilterChange: (value: number[]) => void;
  unitOfMeasureFilter: number[];
  onUnitOfMeasureFilterChange: (value: number[]) => void;
  vendors: Vendor[];
  segments: VendorSegment[];
  categories: ItemCategory[];
  itemTypes: ItemType[];
  unitOfMeasures: UnitOfMeasure[];
  onClearFilters: () => void;
  activeFilterCount: number;
}

export default function ItemFilters({
  searchQuery,
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
  const [vendorSearchTerm, setVendorSearchTerm] = useState('');
  const [segmentSearchTerm, setSegmentSearchTerm] = useState('');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');

  const handleVendorChange = (value: number[]) => {
    if (value.includes(-1)) {
      // Toggle select all
      if (vendorFilter.length === vendors.length) {
        onVendorFilterChange([]);
      } else {
        onVendorFilterChange(vendors.map((v) => v.id));
      }
    } else {
      onVendorFilterChange(value);
    }
  };

  const handleSegmentChange = (value: number[]) => {
    if (value.includes(-1)) {
      // Toggle select all
      if (segmentFilter.length === segments.length) {
        onSegmentFilterChange([]);
      } else {
        onSegmentFilterChange(segments.map((s) => s.id));
      }
    } else {
      onSegmentFilterChange(value);
    }
  };

  const handleCategoryChange = (value: number[]) => {
    if (value.includes(-1)) {
      // Toggle select all
      if (categoryFilter.length === categories.length) {
        onCategoryFilterChange([]);
      } else {
        onCategoryFilterChange(categories.map((c) => c.id));
      }
    } else {
      onCategoryFilterChange(value);
    }
  };

  const handleItemTypeChange = (value: number[]) => {
    if (value.includes(-1)) {
      // Toggle select all
      if (itemTypeFilter.length === itemTypes.length) {
        onItemTypeFilterChange([]);
      } else {
        onItemTypeFilterChange(itemTypes.map((t) => t.id));
      }
    } else {
      onItemTypeFilterChange(value);
    }
  };

  const handleUnitOfMeasureChange = (value: number[]) => {
    if (value.includes(-1)) {
      // Toggle select all
      if (unitOfMeasureFilter.length === unitOfMeasures.length) {
        onUnitOfMeasureFilterChange([]);
      } else {
        onUnitOfMeasureFilterChange(unitOfMeasures.map((u) => u.id));
      }
    } else {
      onUnitOfMeasureFilterChange(value);
    }
  };

  const getFilterLabel = (count: number, total: number, singular: string) => {
    if (count === 0) return `All ${singular}s`;
    if (count === total) return `All ${singular}s`;
    return `${count} ${singular}${count !== 1 ? "s" : ""}`;
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(vendorSearchTerm.toLowerCase())
  );

  const filteredSegments = segments.filter(segment =>
    segment.name.toLowerCase().includes(segmentSearchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={2}>
        {/* Search bar */}
        <TextField
          fullWidth
          placeholder="Search by ID, name, short name, or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="outlined"
          size="medium"
        />

        {/* Filter fields */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl size='small' sx={{ minWidth: 150, flex: 1 }}>
            <InputLabel>Vendor</InputLabel>
            <Select
              multiple
              value={vendorFilter}
              label='Vendor'
              onChange={(e) => handleVendorChange(e.target.value as number[])}
              renderValue={() =>
                getFilterLabel(vendorFilter.length, vendors.length, "Vendor")
              }
              onClose={() => setVendorSearchTerm('')}
            >
              <Box sx={{ px: 2, pb: 1, pt: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search vendors..."
                  fullWidth
                  value={vendorSearchTerm}
                  onChange={(e) => setVendorSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                />
              </Box>
              <MenuItem value={-1}>
                <Checkbox checked={vendorFilter.length === vendors.length} />
                <ListItemText primary='Select All' />
              </MenuItem>
              {filteredVendors.map((vendor) => (
                <MenuItem key={vendor.id} value={vendor.id}>
                  <Checkbox checked={vendorFilter.includes(vendor.id)} />
                  <ListItemText primary={vendor.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size='small' sx={{ minWidth: 150, flex: 1 }}>
            <InputLabel>Segment</InputLabel>
            <Select
              multiple
              value={segmentFilter}
              label='Segment'
              onChange={(e) => handleSegmentChange(e.target.value as number[])}
              renderValue={() =>
                getFilterLabel(segmentFilter.length, segments.length, "Segment")
              }
              onClose={() => setSegmentSearchTerm('')}
            >
              <Box sx={{ px: 2, pb: 1, pt: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search segments..."
                  fullWidth
                  value={segmentSearchTerm}
                  onChange={(e) => setSegmentSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                />
              </Box>
              <MenuItem value={-1}>
                <Checkbox checked={segmentFilter.length === segments.length} />
                <ListItemText primary='Select All' />
              </MenuItem>
              {filteredSegments.map((segment) => (
                <MenuItem key={segment.id} value={segment.id}>
                  <Checkbox checked={segmentFilter.includes(segment.id)} />
                  <ListItemText primary={segment.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size='small' sx={{ minWidth: 150, flex: 1 }}>
            <InputLabel>Category</InputLabel>
            <Select
              multiple
              value={categoryFilter}
              label='Category'
              onChange={(e) => handleCategoryChange(e.target.value as number[])}
              renderValue={() =>
                getFilterLabel(
                  categoryFilter.length,
                  categories.length,
                  "Category"
                )
              }
              onClose={() => setCategorySearchTerm('')}
            >
              <Box sx={{ px: 2, pb: 1, pt: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search categories..."
                  fullWidth
                  value={categorySearchTerm}
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                />
              </Box>
              <MenuItem value={-1}>
                <Checkbox checked={categoryFilter.length === categories.length} />
                <ListItemText primary='Select All' />
              </MenuItem>
              {filteredCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Checkbox checked={categoryFilter.includes(category.id)} />
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size='small' sx={{ minWidth: 150, flex: 1 }}>
            <InputLabel>Item Type</InputLabel>
            <Select
              multiple
              value={itemTypeFilter}
              label='Item Type'
              onChange={(e) => handleItemTypeChange(e.target.value as number[])}
              renderValue={() =>
                getFilterLabel(itemTypeFilter.length, itemTypes.length, "Type")
              }
            >
              <MenuItem value={-1}>
                <Checkbox checked={itemTypeFilter.length === itemTypes.length} />
                <ListItemText primary='Select All' />
              </MenuItem>
              {itemTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  <Checkbox checked={itemTypeFilter.includes(type.id)} />
                  <ListItemText primary={type.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size='small' sx={{ minWidth: 150, flex: 1 }}>
            <InputLabel>UOM</InputLabel>
            <Select
              multiple
              value={unitOfMeasureFilter}
              label='UOM'
              onChange={(e) =>
                handleUnitOfMeasureChange(e.target.value as number[])
              }
              renderValue={() =>
                getFilterLabel(
                  unitOfMeasureFilter.length,
                  unitOfMeasures.length,
                  "Unit"
                )
              }
            >
              <MenuItem value={-1}>
                <Checkbox
                  checked={unitOfMeasureFilter.length === unitOfMeasures.length}
                />
                <ListItemText primary='Select All' />
              </MenuItem>
              {unitOfMeasures.map((uom) => (
                <MenuItem key={uom.id} value={uom.id}>
                  <Checkbox checked={unitOfMeasureFilter.includes(uom.id)} />
                  <ListItemText primary={uom.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={`${activeFilterCount} filter${
                activeFilterCount > 1 ? "s" : ""
              } active`}
              size='small'
              color='primary'
              variant='outlined'
            />
            <IconButton size='small' onClick={onClearFilters} title="Clear all filters">
              <ClearIcon fontSize='small' />
            </IconButton>
          </Box>
        )}
      </Stack>
    </Box>
  );
}