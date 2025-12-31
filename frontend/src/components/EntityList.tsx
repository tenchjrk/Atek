import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

interface EntityListProps<T extends { id: number; name?: string | null }> {
  title: string;
  items: T[];
  loading: boolean;
  error: string | null;
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
  emptyMessage: string;
  renderSecondary?: (item: T) => React.ReactNode;
  getItemName?: (item: T) => string;
  customActions?: (item: T) => React.ReactNode;
}

export default function EntityList<
  T extends { id: number; name?: string | null }
>({
  title,
  items,
  loading,
  error,
  onEdit,
  onDelete,
  emptyMessage,
  renderSecondary,
  getItemName,
  customActions,
}: EntityListProps<T>) {
  const getDisplayName = (item: T): string => {
    if (getItemName) {
      return getItemName(item);
    }
    return item.name || `Item ${item.id}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity='error'>{error}</Alert>;
  }

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography color='text.secondary'>{emptyMessage}</Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "primary.main",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant='h6' sx={{ color: "white" }}>
          {title}
        </Typography>
        <Typography variant='body2' sx={{ color: "white" }}>
          {items.length} {items.length === 1 ? "item" : "items"}
        </Typography>
      </Box>
      <List>
        {items.map((item, index) => (
          <ListItem
            key={item.id}
            divider={index < items.length - 1}
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <ListItemText
              primary={getDisplayName(item)}
              secondary={renderSecondary ? renderSecondary(item) : undefined}
              sx={{ flex: 1, mb: { xs: 1, sm: 0 } }}
              slotProps={{
  secondary: {
    component: 'div'
  }
}}
            />
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignSelf: { xs: "flex-end", sm: "center" },
              }}
            >
              {customActions && customActions(item)}
              <IconButton
                aria-label='edit'
                onClick={() => onEdit(item)}
                size='small'
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label='delete'
                onClick={() => onDelete(item.id)}
                size='small'
                sx={{
                  color: "error.main",
                  "&:hover": {
                    backgroundColor: "error.light",
                    color: "error.dark",
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
