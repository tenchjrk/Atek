import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

interface EntityListProps<T extends { id: number; name: string }> {
  title: string;
  items: T[];
  loading: boolean;
  error: string | null;
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
  emptyMessage?: string;
}

export default function EntityList<T extends { id: number; name: string }>({
  title,
  items,
  loading,
  error,
  onEdit,
  onDelete,
  emptyMessage = 'No items yet. Create your first item above.',
}: EntityListProps<T>) {
  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">
          {title} ({items.length})
        </Typography>
      </Box>

      {items.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">{emptyMessage}</Typography>
        </Box>
      ) : (
        <List>
          {items.map((item, index) => (
            <ListItem
              key={item.id}
              divider={index < items.length - 1}
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => onEdit(item)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onDelete(item.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={item.name}
                secondary={`ID: ${item.id}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}