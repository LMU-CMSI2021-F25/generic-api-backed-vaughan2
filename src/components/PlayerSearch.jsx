import { useState, useEffect, useRef } from 'react';
import { searchPlayers } from '../api/api';
import { Box, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// Search component
export default function PlayerSearch({ onAddPlayer }) {
  // Current search query
  const [query, setQuery] = useState('');
  // Array of search results
  const [results, setResults] = useState([]);
  // Loading indicator for search
  const [loading, setLoading] = useState(false);
  // Error message if search fails
  const [error, setError] = useState(null);
  // Input element for programmatic focus
  const inputRef = useRef(null);

  const runSearch = async () => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const players = await searchPlayers(query);
      setResults(players.filter(p => !!p.id).slice(0, 20));
    } catch (err) {
      setError('Failed to search players');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      runSearch();
    }, 300);
    return () => clearTimeout(searchTimeout);
  }, [query]);

  return (
    <Box sx={{ width: { xs: '100%', sm: 688 }, mx: 'auto', mb: 3, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <TextField
        placeholder={query.length === 0 ? 'Search for an NFL player' : ''}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: '#ffffff',
            '& fieldset': { borderColor: '#e5e7eb' },
            '&:hover fieldset': { borderColor: '#000000' },
            '&.Mui-focused fieldset': { borderColor: '#000000', borderWidth: 2 },
          },
        }}
        inputRef={inputRef}
      />

      {loading && (
        <Typography sx={{ mt: 2 }} color="text.secondary" align="center">Searching...</Typography>
      )}
      
      {error && (
        <Typography sx={{ mt: 2 }} color="error" align="center">{error}</Typography>
      )}

      {results.length > 0 && (
        <Paper sx={{ mt: 2, width: '100%', boxShadow: 'none', border: '1px solid #e5e7eb', borderRadius: 3, backgroundColor: '#ffffff' }}>
          <List dense>
            {results.map((player) => (
              player.id && (
                <ListItem key={player.id}
                  secondaryAction={
                    // Add button - clears search and refocuses input on click
                    <IconButton aria-label="add" onClick={() => { onAddPlayer(player); setQuery(''); setResults([]); inputRef.current && inputRef.current.focus(); }}
                      sx={{ mr: 1, '&:hover': { backgroundColor: '#000000' }, '&:hover .MuiSvgIcon-root': { color: '#ffffff' } }}>
                      <AddIcon sx={{ color: 'inherit' }} />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={player.image || undefined} alt={player.name} />
                  </ListItemAvatar>
                  <ListItemText primary={player.name} secondary={player.team} />
                </ListItem>
              )
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

