export async function searchPlayers(query) {
    try {
        const response = await fetch(`https://site.web.api.espn.com/apis/search/v2?query=${encodeURIComponent(query)}&limit=10&type=player`);
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();
        const contents = (data.results && data.results[0]?.contents) || [];
        return contents.map(item => {
            const idMatch = item.uid?.match(/a:(\\d+)/);
            return {
                id: idMatch ? idMatch[1] : null,
                name: item.displayName,
                team: item.subtitle,
                image: item.image?.default
            };
        });
    } catch (error) {
        console.error("Error searching players", error);
        throw error;
    }
}

export async function getPlayerStats(id) {
    try {
        const response = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes/${id}/statistics`);
        if (!response.ok) throw new Error("Stats fetch failed");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching stats", error);
        throw error;
    }
}
