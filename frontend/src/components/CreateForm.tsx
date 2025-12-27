import { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface CreateFormProps {
  onSubmit: (name: string) => Promise<boolean>;
  placeholder?: string;
  buttonText?: string;
}

export default function CreateForm({
  onSubmit,
  placeholder = 'Name',
  buttonText = 'Add',
}: CreateFormProps) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await onSubmit(name);
    if (success) {
      setName('');
    }
    setSubmitting(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            label={placeholder}
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={submitting}
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ minWidth: '150px' }}
            disabled={submitting}
          >
            {buttonText}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}