import { useEffect, useState } from 'react';
import { accountApi, type Account } from '../services/api';
import {
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [name, setName] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await accountApi.getAll();
        setAccounts(response.data);
      } catch (error) {
        console.error('Error loading accounts:', error);
      }
    };
    
    fetchAccounts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await accountApi.create({ name });
      setName('');
      const response = await accountApi.getAll();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingAccount) return;
    
    try {
      await accountApi.update(editingAccount.id, { 
        id: editingAccount.id, 
        name: editingName 
      });
      setEditDialogOpen(false);
      setEditingAccount(null);
      setEditingName('');
      const response = await accountApi.getAll();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await accountApi.delete(id);
      const response = await accountApi.getAll();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const openEditDialog = (account: Account) => {
    setEditingAccount(account);
    setEditingName(account.name);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingAccount(null);
    setEditingName('');
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Account Management
      </Typography>

      {/* Create Account Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleCreate}>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Account Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ minWidth: '150px' }}
            >
              Add Account
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* Accounts List */}
      <Paper elevation={3}>
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">
            Accounts ({accounts.length})
          </Typography>
        </Box>
        
        {accounts.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No accounts yet. Create your first account above.
            </Typography>
          </Box>
        ) : (
          <List>
            {accounts.map((account, index) => (
              <ListItem
                key={account.id}
                divider={index < accounts.length - 1}
                secondaryAction={
                  <Box>
                    <IconButton 
                      edge="end" 
                      aria-label="edit"
                      onClick={() => openEditDialog(account)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => handleDelete(account.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={account.name}
                  secondary={`Account ID: ${account.id}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={closeEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Account</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Account Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}