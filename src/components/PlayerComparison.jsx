import { useState, useEffect } from 'react';
import { getPlayerStats } from '../api/api';
import { parsePlayerStats } from '../utils/statsParser';
import { Box, Paper, Typography, Avatar, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Player comparison component
export default function PlayerComparison({ players, onRemovePlayer }) {
  // Object mapping player IDs to their parsed stats arrays
  const [playersStats, setPlayersStats] = useState({});
  // Array of all unique stat names sorted by max value
  const [allStatNames, setAllStatNames] = useState([]);

  useEffect(() => {
    players.forEach(async (player) => {
        
        try {
          const statsData = await getPlayerStats(player.id);
          const parsedStats = parsePlayerStats(statsData);
          
          setPlayersStats(prev => ({
            ...prev,
            [player.id]: parsedStats
          }));
        } catch (error) {
          console.error(`Failed to load stats for ${player.name}`, error);
          setPlayersStats(prev => ({
            ...prev,
            [player.id]: []
          }));
        } 
      }
    );
  }, [players]);

  useEffect(() => {
    // Collect all unique stat names
    const statNamesSet = new Set();
    const statNameToInfo = {};

    Object.values(playersStats).forEach(stats => {
      stats.forEach(stat => {
        statNamesSet.add(stat.name);
        if (!statNameToInfo[stat.name]) {
          statNameToInfo[stat.name] = {
            name: stat.name,
            category: stat.category,
            description: stat.description
          };
        }
      });
    });

    // Calculate max value for each stat across all players
    const statNames = Array.from(statNamesSet).map(name => {
      let maxValue = 0;
      Object.values(playersStats).forEach(stats => {
        const stat = stats.find(s => s.name === name);
        if (stat && stat.value > maxValue) {
          maxValue = stat.value;
        }
      });
      return { ...statNameToInfo[name], maxValue };
    });

    // Sort by max value (highest first)
    statNames.sort((a, b) => b.maxValue - a.maxValue);

    setAllStatNames(statNames);
  }, [playersStats]);

  // No players added, blank space
  if (players.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
        <Typography></Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 0, flex: 1 }}>
      {/* Comparison table container */}
      <Paper sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1, width: 'fit-content', minWidth: { xs: '100%', sm: 960 }, maxWidth: 'calc(100% - 32px)', boxShadow: 'none', border: '1px solid #e5e7eb', borderRadius: 3, backgroundColor: '#ffffff' }}>
        <TableContainer sx={{ flex: 1, minHeight: 0, px: 2, pb: 2, pt: 0, overflowX: 'auto' }}>
          <Table stickyHeader size="small" aria-label="player stats comparison" sx={{ tableLayout: 'auto', '& .MuiTableCell-root': { borderBottom: '1px solid #e5e7eb' } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: { xs: 160, sm: 220 }, top: 0, px: 3 }} />
                {players.map(p => (
                  <TableCell key={p.id} align="center" sx={{ top: 0, px: 3, minWidth: { xs: 120, sm: 160, md: 200 } }}>
                    <Typography align="center" fontWeight={700}>{p.name}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ px: 3 }} />
                {players.map(player => (
                  <TableCell key={player.id} align="center" sx={{ px: 3, minWidth: { xs: 120, sm: 160, md: 200 } }}>
                    <Stack direction="column" alignItems="center" spacing={1} sx={{ position: 'relative' }}>
                      <Avatar src={player.image || undefined} alt={player.name} sx={{ width: 56, height: 56 }} />
                      <IconButton sx={{ position: 'absolute', top: -6, right: -6, '&:focus-visible': { outline: '2px solid #3b82f6', outlineOffset: '2px' }, '&:hover': { backgroundColor: '#000000' }, '&:hover .MuiSvgIcon-root': { color: '#ffffff' } }} size="small" onClick={() => onRemovePlayer(player.id)} aria-label="remove">
                        <CloseIcon fontSize="small" sx={{ color: 'inherit' }} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
              
              {/* Stats rows */}
              {allStatNames.map(statInfo => (
                <TableRow key={statInfo.name} hover>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Tooltip title={statInfo.description || ''} disableInteractive>
                        <Typography fontWeight={600}>{statInfo.name}</Typography>
                      </Tooltip>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                        {statInfo.category}
                      </Typography>
                    </Stack>
                  </TableCell>
                  {/* Individual stat value cells */}
                  {players.map(player => {
                    const playerStatsList = playersStats[player.id] || [];
                    const stat = playerStatsList.find(s => s.name === statInfo.name);
                    return (
                      <TableCell key={player.id} align="center" sx={{ px: 3, minWidth: { xs: 120, sm: 160, md: 200 } }}>
                        {stat ? stat.displayValue : '—'}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

