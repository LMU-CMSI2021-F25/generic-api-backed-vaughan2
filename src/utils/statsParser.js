export function parsePlayerStats(statsData) {
  if (!statsData || !statsData.splits || !statsData.splits.categories) {
    return [];
  }

  const allStats = [];
  const categories = statsData.splits.categories;

  categories.forEach(category => {
    if (category.stats && Array.isArray(category.stats)) {
      category.stats.forEach(stat => {
        // Only include stats > 0
        if (stat.value && stat.value > 0) {
          allStats.push({
            category: category.displayName,
            name: stat.displayName,
            shortName: stat.shortDisplayName,
            value: stat.value,
            displayValue: stat.displayValue,
            description: stat.description,
            abbreviation: stat.abbreviation
          });
        }
      });
    }
  });

  // Sort by highest value first regardless of what the actual stat is
  allStats.sort((a, b) => b.value - a.value);

  return allStats;
}

export function groupStatsByCategory(stats) {
  const grouped = {};
  
  stats.forEach(stat => {
    if (!grouped[stat.category]) {
      grouped[stat.category] = [];
    }
    grouped[stat.category].push(stat);
  });

  return grouped;
}

// Get the top n highest number stats regardless of what the actual stat is
export function getTopStats(stats, count = 20) {
  return stats.slice(0, count);
}

