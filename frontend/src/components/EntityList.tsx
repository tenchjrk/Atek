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
  useMediaQuery,
  useTheme,
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
  renderSecondary?: (item: T) => string | React.ReactNode;
}

export default function EntityList<T extends { id: number; name: string }>({
  title,
  items,
  loading,
  error,
  onEdit,
  onDelete,
  emptyMessage = 'No items yet. Create your first item above.',
  renderSecondary,
}: EntityListProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 1, sm: 0 },
                py: { xs: 2, sm: 1 },
              }}
            >
              <ListItemText
                primary={item.name}
                secondary={renderSecondary ? renderSecondary(item) : `ID: ${item.id}`}
                sx={{
                  flex: 1,
                  pr: { xs: 0, sm: 2 },
                  wordBreak: 'break-word',
                  minWidth: 0,
                }}
              />
              <Box 
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  alignSelf: { xs: 'flex-end', sm: 'center' },
                  flexShrink: 0,
                }}
              >
                <IconButton
                  aria-label="edit"
                  onClick={() => onEdit(item)}
                  size={isMobile ? 'small' : 'medium'}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => onDelete(item.id)}
                  color="error"
                  size={isMobile ? 'small' : 'medium'}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}