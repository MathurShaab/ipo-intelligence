/**
 * IPO Intelligence - Future-Compatible Watchlist & Preferences Service
 * Uses localStorage in initial build; structured with async methods so a
 * backend database adapter can replace storage seamlessly in future phases.
 */
class WatchlistService {
  constructor() {
    this.STORAGE_KEY = 'ipo_intelligence_watchlist_v1';
    this.PREFS_KEY = 'ipo_intelligence_prefs_v1';
  }

  async getWatchlistIds() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Watchlist read error:', e);
      return [];
    }
  }

  async isWatched(ipoId) {
    const ids = await this.getWatchlistIds();
    return ids.includes(ipoId);
  }

  async toggleWatchlist(ipoId) {
    const ids = await this.getWatchlistIds();
    const exists = ids.includes(ipoId);
    const updated = exists ? ids.filter((id) => id !== ipoId) : [...ids, ipoId];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('watchlist:changed', { detail: { ids: updated, ipoId, added: !exists } }));
    return !exists;
  }

  async getWatchlistCount() {
    const ids = await this.getWatchlistIds();
    return ids.length;
  }
}

window.watchlistService = new WatchlistService();
